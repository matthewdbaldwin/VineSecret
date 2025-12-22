import axios from 'axios';
import types from './types';
import { findProductById, products as fallbackProducts } from '../data/products';

const LOCAL_CART_KEY = 'sc-local-cart';
const LOCAL_ORDER_KEY = 'sc-guest-orders';
let cartApiUnavailable = false;

const readLocalCart = () => {
    try {
        const stored = localStorage.getItem(LOCAL_CART_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        return [];
    }
};

const persistLocalCart = (items) => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
};

const clearLocalCart = () => {
    localStorage.removeItem(LOCAL_CART_KEY);
};

const readLocalOrders = () => {
    try {
        const stored = localStorage.getItem(LOCAL_ORDER_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        return [];
    }
};

const persistGuestOrder = (order) => {
    const existingOrders = readLocalOrders();
    const nextOrders = [order, ...existingOrders].slice(0, 25);
    localStorage.setItem(LOCAL_ORDER_KEY, JSON.stringify(nextOrders));
};

const findLocalGuestOrder = (email, orderId) => {
    const normalizedEmail = String(email || '').toLowerCase();
    return readLocalOrders().find(
        (order) => String(order.id) === String(orderId) && String(order.email || '').toLowerCase() === normalizedEmail,
    );
};

const deriveCartFromLocal = (items) => {
    const enrichedItems = items
        .map((item) => {
            const product = findProductById(item.id);
            if (!product) return null;

            return {
                ...product,
                quantity: item.quantity,
                lineTotal: item.quantity * product.cost,
            };
        })
        .filter(Boolean);

    const subtotal = enrichedItems.reduce((total, item) => total + item.lineTotal, 0);
    const bottleCount = enrichedItems.reduce((total, item) => total + item.quantity, 0);
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
};

const syncLocalCartState = (items, dispatch) => {
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
};

const loadLocalCart = (dispatch) => {
    const items = readLocalCart();
    return syncLocalCartState(items, dispatch);
};

const getCartConfig = () => ({
    headers: {
        'x-cart-token': localStorage.getItem('sc-cart-token'),
    },
});

export const getAllProducts = () => async (dispatch) => {
    try {
        const response = await axios.get(`/api/products`);
        const products =
            response?.data?.products && response.data.products.length ? response.data.products : fallbackProducts;

        dispatch({
            type: types.GET_ALL_PRODUCTS,
            products,
        });
    } catch (error) {
        dispatch({
            type: types.GET_ALL_PRODUCTS,
            products: fallbackProducts,
        });
    }
};

export const getProductDetails = (productId) => async (dispatch) => {
    try {
        const resp = await axios.get(`/api/products/${productId}`);
        const productFromApi = resp?.data && Object.keys(resp.data).length ? resp.data : null;
        const fallbackProduct = findProductById(productId);
        const product = productFromApi ? { ...fallbackProduct, ...productFromApi } : fallbackProduct;

        dispatch({
            type: types.GET_PRODUCT_DETAILS,
            product,
        });
    } catch (error) {
        dispatch({
            type: types.GET_PRODUCT_DETAILS,
            product: findProductById(productId),
        });
    }
};

export const addItemToCart = (productId, quantity) => async (dispatch) => {
    const currentItems = readLocalCart();
    const existingItem = currentItems.find((item) => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        currentItems.push({ id: productId, quantity });
    }

    const localCart = syncLocalCartState(currentItems, dispatch);

    if (!cartApiUnavailable) {
        try {
            const resp = await axios.post(
                `/api/cart/items/${productId}`,
                {
                    quantity,
                },
                getCartConfig(),
            );

            if (resp?.data?.cartToken) {
                localStorage.setItem('sc-cart-token', resp.data.cartToken);
            }

            dispatch({
                type: types.ADD_ITEM_TO_CART,
                cartTotal: resp?.data?.total ?? localCart.total,
                cart: resp?.data ?? localCart,
            });
            return;
        } catch (error) {
            if (error?.response?.status === 404) {
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

export const getActiveCart = () => async (dispatch) => {
    if (cartApiUnavailable) {
        loadLocalCart(dispatch);
        return;
    }

    try {
        const resp = await axios.get(`/api/cart`, getCartConfig());
        const cart = resp?.data;

        if (cart?.items?.length) {
            const minimalItems = cart.items.map((item) => ({ id: item.id, quantity: item.quantity }));
            persistLocalCart(minimalItems);
        }

        dispatch({
            type: types.GET_ACTIVE_CART,
            cart,
        });
        dispatch({
            type: types.GET_CART_TOTALS,
            total: cart?.total,
        });
    } catch (err) {
        if (err?.response?.status === 404) {
            cartApiUnavailable = true;
        }
        loadLocalCart(dispatch);
    }
};

export const getCartTotals = () => async (dispatch) => {
    if (cartApiUnavailable) {
        const { total } = loadLocalCart(dispatch);
        dispatch({ type: types.GET_CART_TOTALS, total });
        return;
    }

    try {
        const resp = await axios.get(`/api/cart/totals`, getCartConfig());

        dispatch({
            type: types.GET_CART_TOTALS,
            total: resp?.data,
        });
    } catch (err) {
        if (err?.response?.status === 404) {
            cartApiUnavailable = true;
        }
        const { total } = loadLocalCart(dispatch);

        dispatch({
            type: types.GET_CART_TOTALS,
            total,
        });
    }
};

export const updateLocalCartItem = (productId, quantity) => (dispatch) => {
    const currentItems = readLocalCart();
    const filteredItems = currentItems.filter((item) => item.id !== productId);

    if (quantity > 0) {
        filteredItems.push({ id: productId, quantity });
    }

    syncLocalCartState(filteredItems, dispatch);
};

export const createGuestOrder = (guest) => async (dispatch) => {
    let lastKnownCart = deriveCartFromLocal(readLocalCart());

    if (!cartApiUnavailable) {
        try {
            const cartToken = localStorage.getItem('sc-cart-token');
            const axiosConfig = {
                headers: {
                    'x-cart-token': cartToken,
                },
            };

            const res = await axios.post(`/api/orders/guest`, guest, axiosConfig);
            lastKnownCart = res?.data?.cart ?? lastKnownCart;

            localStorage.removeItem('sc-cart-token');
            clearLocalCart();

            persistGuestOrder({
                id: res.data.id,
                message: res.data.message,
                email: guest.email,
                cart: lastKnownCart,
                guest,
                createdAt: Date.now(),
            });

            dispatch({
                type: types.CREATE_GUEST_ORDER,
                order: {
                    id: res.data.id,
                    message: res.data.message,
                },
            });

            return {
                email: guest.email,
                orderId: res.data.id,
                message: res.data.message,
                cart: lastKnownCart,
            };
        } catch (err) {
            if (err?.response?.status === 404) {
                cartApiUnavailable = true;
            }
        }
    }

    const cart = loadLocalCart(dispatch);
    const fallbackOrder = {
        id: `VS-${Date.now()}`,
        message: 'Order received. A confirmation email is on the way.',
        email: guest.email,
        cart,
        guest,
        createdAt: Date.now(),
    };

    persistGuestOrder(fallbackOrder);
    clearLocalCart();

    dispatch({
        type: types.CREATE_GUEST_ORDER,
        order: {
            id: fallbackOrder.id,
            message: fallbackOrder.message,
        },
    });

    return {
        email: guest.email,
        orderId: fallbackOrder.id,
        message: fallbackOrder.message,
        cart,
    };
};

export const getGuestOrderDetails = (email, orderId) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/orders/guest/${orderId}?email=${email}`);

        dispatch({
            type: types.GET_GUEST_ORDER_DETAILS,
            details: res.data,
        });
        console.log('OrderDetail actions.js get:', res.data);
    } catch (err) {
        const localOrder = findLocalGuestOrder(email, orderId);

        if (localOrder) {
            dispatch({
                type: types.GET_GUEST_ORDER_DETAILS,
                details: localOrder,
            });
            return;
        }

        console.log('Error with guest details:', err);
    }
};

export const clearProductDetails = () => ({ type: types.CLEAR_PRODUCT_DETAILS });
