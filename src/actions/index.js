import axios from 'axios';
import types from './types';
import { findProductById, products as fallbackProducts } from '../data/products';

const LOCAL_CART_KEY = 'sc-local-cart';
let cartApiUnavailable = false;

function readLocalCart() {
    try {
        const stored = localStorage.getItem(LOCAL_CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        return [];
    }
}

function persistLocalCart(items) {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

function deriveCartFromLocal(items) {
    const enrichedItems = items
        .map(function deriveLocalItem(item) {
            const product = findProductById(item.id);
            if (!product) return null;

            return {
                ...product,
                quantity: item.quantity,
                lineTotal: item.quantity * product.cost,
            };
        })
        .filter(Boolean);

    const subtotal = enrichedItems.reduce(function sumSubtotal(total, item) {
        return total + item.lineTotal;
    }, 0);
    const bottleCount = enrichedItems.reduce(function sumQuantity(total, item) {
        return total + item.quantity;
    }, 0);
    const shipping = bottleCount >= 3 || subtotal === 0 ? 0 : 1500;
    const tax = Math.round(subtotal * 0.085);
    const grandTotal = subtotal + shipping + tax;

    return {
        cartId: 'local-cart',
        items: enrichedItems,
        total: {
            subtotal,
            shipping,
            tax,
            grandTotal,
        },
    };
}

function syncLocalCartState(items, dispatch) {
    persistLocalCart(items);
    const cart = deriveCartFromLocal(items);

    dispatch({
        type: types.GET_ACTIVE_CART,
        cart,
    });

    dispatch({
        type: types.GET_CART_TOTALS,
        total: cart.total,
    });

    return cart;
}

function getCartConfig() {
    const cartToken = localStorage.getItem('sc-cart-token');

    return {
        headers: {
            'x-cart-token': cartToken,
        },
    };
}

function loadLocalCart(dispatch) {
    const items = readLocalCart();
    return syncLocalCartState(items, dispatch);
}

export function getAllProducts() {
    return async function dispatchProducts(dispatch) {
        try {
            const response = await axios.get(`/api/products`);
            const products =
                response && response.data && response.data.products && response.data.products.length
                    ? response.data.products
                    : fallbackProducts;

            dispatch({
                type: types.GET_ALL_PRODUCTS,
                products,
            });
        } catch (err) {
            dispatch({
                type: types.GET_ALL_PRODUCTS,
                products: fallbackProducts,
            });
        }
    };
}

export function getProductDetails(productId) {
    return async function dispatchProductDetails(dispatch) {
        try {
            const resp = await axios.get(`/api/products/${productId}`);
            const productFromApi = resp && resp.data && Object.keys(resp.data).length ? resp.data : null;
            const fallbackProduct = findProductById(productId);
            const product = productFromApi ? { ...fallbackProduct, ...productFromApi } : fallbackProduct;

            dispatch({
                type: types.GET_PRODUCT_DETAILS,
                product,
            });
        } catch (err) {
            const product = findProductById(productId);

            dispatch({
                type: types.GET_PRODUCT_DETAILS,
                product,
            });
        }
    };
}

export function addItemToCart(productId, quantity) {
    return async function dispatchAddItem(dispatch) {
        function updateLocalCart() {
            const currentItems = readLocalCart();
            const existingItem = currentItems.find(function findExisting(item) {
                return item.id === productId;
            });

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                currentItems.push({ id: productId, quantity });
            }

            return syncLocalCartState(currentItems, dispatch);
        }

        const localCart = updateLocalCart();

        if (!cartApiUnavailable) {
            try {
                const resp = await axios.post(
                    `/api/cart/items/${productId}`,
                    {
                        quantity,
                    },
                    getCartConfig()
                );

                localStorage.setItem('sc-cart-token', resp.data.cartToken);

                dispatch({
                    type: types.ADD_ITEM_TO_CART,
                    cartTotal: resp.data.total,
                    cart: localCart,
                });

                return;
            } catch (error) {
                if (error && error.response && error.response.status === 404) {
                    cartApiUnavailable = true;
                }
            }
        }

        dispatch({
            type: types.ADD_ITEM_TO_CART,
            cartTotal: localCart.total,
            cart: localCart,
        });
    };
}

export function getActiveCart() {
    return async function dispatchActiveCart(dispatch) {
        if (cartApiUnavailable) {
            loadLocalCart(dispatch);
            return;
        }

        try {
            const resp = await axios.get(`/api/cart`, getCartConfig());
            dispatch({
                type: types.GET_ACTIVE_CART,
                cart: resp.data,
            });
        } catch (err) {
            if (err && err.response && err.response.status === 404) {
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
            const resp = await axios.get(`/api/cart/totals`, getCartConfig());

            dispatch({
                type: types.GET_CART_TOTALS,
                total: resp.data,
            });
        } catch (err) {
            if (err && err.response && err.response.status === 404) {
                cartApiUnavailable = true;
            }
            const { total } = loadLocalCart(dispatch);

            dispatch({
                type: types.GET_CART_TOTALS,
                total,
            });
        }
    };
}

export function updateLocalCartItem(productId, quantity) {
    return function dispatchUpdateLocal(dispatch) {
        const currentItems = readLocalCart();
        const filteredItems = currentItems.filter(function filterItems(item) {
            return item.id !== productId;
        });

        if (quantity > 0) {
            filteredItems.push({ id: productId, quantity });
        }

        syncLocalCartState(filteredItems, dispatch);
    };
}

export function createGuestOrder(guest) {
    return async function dispatchCreateGuest(dispatch) {
        try {
            const res = await axios.post(`/api/orders/guest`, guest, getCartConfig());

            localStorage.removeItem('sc-cart-token');

            dispatch({
                type: types.CREATE_GUEST_ORDER,
                order: {
                    id: res.data.id,
                    message: res.data.message,
                },
            });

            return {
                email: guest.email,
                order_Id: res.data.id,
            };
        } catch (err) {
            console.log('Error from Guest checkout', err);
        }
    };
}

export function getGuestOrderDetails(email, orderId) {
    return async function dispatchGuestDetails(dispatch) {
        try {
            const res = await axios.get(`/api/orders/guest/${orderId}?email=${email}`);

            dispatch({
                type: types.GET_GUEST_ORDER_DETAILS,
                details: res.data,
            });
            console.log('OrderDetail actions.js get:', res.data);
        } catch (err) {
            console.log('Error with guest details:', err);
        }
    };
}

export function clearProductDetails() {
    return { type: types.CLEAR_PRODUCT_DETAILS };
}
