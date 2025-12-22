import axios from 'axios';
import types from './types';
import { findProductById, products as fallbackProducts } from '../data/products';

const LOCAL_CART_KEY = 'sc-local-cart';
let cartApiUnavailable = false;

function readLocalCartItems() {
    try {
        const stored = localStorage.getItem(LOCAL_CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        return [];
    }
}

function writeLocalCartItems(items) {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

function calculateCart(items) {
    const hydrated = items
        .map(function hydrateItem(item) {
            const product = findProductById(item.id);
            if (!product) return null;

            return {
                ...product,
                quantity: item.quantity,
                lineTotal: product.cost * item.quantity,
            };
        })
        .filter(Boolean);

    const subtotal = hydrated.reduce(function sumSubtotal(total, item) {
        return total + item.lineTotal;
    }, 0);
    const bottleCount = hydrated.reduce(function sumQuantity(total, item) {
        return total + item.quantity;
    }, 0);

    const shipping = bottleCount >= 3 || subtotal === 0 ? 0 : 1500;
    const tax = Math.round(subtotal * 0.085);
    const grandTotal = subtotal + shipping + tax;

    return {
        cartId: 'local-cart',
        items: hydrated,
        total: {
            subtotal,
            shipping,
            tax,
            grandTotal,
        },
    };
}

function updateLocalCartState(items, dispatch) {
    writeLocalCartItems(items);
    const cart = calculateCart(items);

    dispatch({ type: types.GET_ACTIVE_CART, cart });
    dispatch({ type: types.GET_CART_TOTALS, total: cart.total });

    return cart;
}

function getCartConfig() {
    const cartToken = localStorage.getItem('sc-cart-token');
    return { headers: { 'x-cart-token': cartToken } };
}

function loadLocalCart(dispatch) {
    const items = readLocalCartItems();
    return updateLocalCartState(items, dispatch);
}

export function getAllProducts() {
    return async function dispatchProducts(dispatch) {
        try {
            const response = await axios.get('/api/products');
            const products =
                response && response.data && response.data.products && response.data.products.length
                    ? response.data.products
                    : fallbackProducts;

            dispatch({ type: types.GET_ALL_PRODUCTS, products });
        } catch (error) {
            dispatch({ type: types.GET_ALL_PRODUCTS, products: fallbackProducts });
        }
    };
}

export function getProductDetails(productId) {
    return async function dispatchProductDetails(dispatch) {
        try {
            const response = await axios.get(`/api/products/${productId}`);
            const apiProduct = response && response.data && Object.keys(response.data).length ? response.data : null;
            const fallbackProduct = findProductById(productId);
            const product = apiProduct ? { ...fallbackProduct, ...apiProduct } : fallbackProduct;

            dispatch({ type: types.GET_PRODUCT_DETAILS, product });
        } catch (error) {
            const product = findProductById(productId);
            dispatch({ type: types.GET_PRODUCT_DETAILS, product });
        }
    };
}

export function addItemToCart(productId, quantity) {
    return async function dispatchAddItem(dispatch) {
        const currentItems = readLocalCartItems();
        const existingItem = currentItems.find(function findExisting(item) {
            return item.id === productId;
        });

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            currentItems.push({ id: productId, quantity });
        }

        const localCart = updateLocalCartState(currentItems, dispatch);

        if (cartApiUnavailable) {
            dispatch({ type: types.ADD_ITEM_TO_CART, cartTotal: localCart.total, cart: localCart });
            return;
        }

        try {
            const response = await axios.post(
                `/api/cart/items/${productId}`,
                { quantity },
                getCartConfig()
            );

            if (response && response.data && response.data.cartToken) {
                localStorage.setItem('sc-cart-token', response.data.cartToken);
            }

            dispatch({
                type: types.ADD_ITEM_TO_CART,
                cartTotal: response && response.data && response.data.total ? response.data.total : localCart.total,
                cart: localCart,
            });
        } catch (error) {
            if (error && error.response && error.response.status === 404) {
                cartApiUnavailable = true;
            }
            dispatch({ type: types.ADD_ITEM_TO_CART, cartTotal: localCart.total, cart: localCart });
        }
    };
}

export function getActiveCart() {
    return async function dispatchActiveCart(dispatch) {
        if (cartApiUnavailable) {
            loadLocalCart(dispatch);
            return;
        }

        try {
            const response = await axios.get('/api/cart', getCartConfig());
            dispatch({ type: types.GET_ACTIVE_CART, cart: response.data });
        } catch (error) {
            if (error && error.response && error.response.status === 404) {
                cartApiUnavailable = true;
            }
            loadLocalCart(dispatch);
        }
    };
}

export function getCartTotals() {
    return async function dispatchCartTotals(dispatch) {
        if (cartApiUnavailable) {
            const { total } = loadLocalCart(dispatch);
            dispatch({ type: types.GET_CART_TOTALS, total });
            return;
        }

        try {
            const response = await axios.get('/api/cart/totals', getCartConfig());
            dispatch({ type: types.GET_CART_TOTALS, total: response.data });
        } catch (error) {
            if (error && error.response && error.response.status === 404) {
                cartApiUnavailable = true;
            }
            const { total } = loadLocalCart(dispatch);
            dispatch({ type: types.GET_CART_TOTALS, total });
        }
    };
}

export function updateLocalCartItem(productId, quantity) {
    return function dispatchUpdateLocal(dispatch) {
        const currentItems = readLocalCartItems();
        const filteredItems = currentItems.filter(function filterItem(item) {
            return item.id !== productId;
        });

        if (quantity > 0) {
            filteredItems.push({ id: productId, quantity });
        }

        updateLocalCartState(filteredItems, dispatch);
    };
}

export function createGuestOrder(guest) {
    return async function dispatchCreateGuest(dispatch) {
        try {
            const response = await axios.post('/api/orders/guest', guest, getCartConfig());
            localStorage.removeItem('sc-cart-token');

            dispatch({
                type: types.CREATE_GUEST_ORDER,
                order: {
                    id: response.data.id,
                    message: response.data.message,
                },
            });

            return { email: guest.email, order_Id: response.data.id };
        } catch (error) {
            console.log('Error from Guest checkout', error);
        }
    };
}

export function getGuestOrderDetails(email, orderId) {
    return async function dispatchGuestDetails(dispatch) {
        try {
            const response = await axios.get(`/api/orders/guest/${orderId}?email=${email}`);
            dispatch({ type: types.GET_GUEST_ORDER_DETAILS, details: response.data });
            console.log('OrderDetail actions.js get:', response.data);
        } catch (error) {
            console.log('Error with guest details:', error);
        }
    };
}

export function clearProductDetails() {
    return { type: types.CLEAR_PRODUCT_DETAILS };
}
