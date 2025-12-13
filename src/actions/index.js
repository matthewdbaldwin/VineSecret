import axios from 'axios';
import types from './types';
import { findProductById, products as fallbackProducts } from '../data/products';

const LOCAL_CART_KEY = 'sc-local-cart';

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

export const getAllProducts = () => async (dispatch) => {
    try {
        const response = await axios.get(`/api/products`);
        const products = response.data?.products?.length ? response.data.products : fallbackProducts;

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

export const getProductDetails = (productId) => async (dispatch) => {
    try {
        const resp = await axios.get(`/api/products/${productId}`);
        const productFromApi = resp.data && Object.keys(resp.data).length ? resp.data : null;
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

export const addItemToCart = (productId, quantity) => async (dispatch) => {
    const updateLocalCart = () => {
        const currentItems = readLocalCart();
        const existingItem = currentItems.find((item) => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            currentItems.push({ id: productId, quantity });
        }

        return syncLocalCartState(currentItems, dispatch);
    };

    const localCart = updateLocalCart();

    try {
        const cartToken = localStorage.getItem('sc-cart-token');
        const axiosConfig = {
            headers: {
                'x-cart-token': cartToken,
            },
        };

        const resp = await axios.post(
            `/api/cart/items/${productId}`,
            {
                quantity,
            },
            axiosConfig,
        );

        localStorage.setItem('sc-cart-token', resp.data.cartToken);

        dispatch({
            type: types.ADD_ITEM_TO_CART,
            cartTotal: resp.data.total,
            cart: localCart,
        });
    } catch (error) {
        dispatch({
            type: types.ADD_ITEM_TO_CART,
            cartTotal: localCart.total,
            cart: localCart,
        });
    }
};

export const getActiveCart = () => async (dispatch) => {
    try {
        const cartToken = localStorage.getItem('sc-cart-token');
        const axiosConfig = {
            headers: {
                'x-cart-token': cartToken,
            },
        };

        const resp = await axios.get(`/api/cart`, axiosConfig);
        // console.log('Get active cart server response:', resp);
        dispatch({
            type: types.GET_ACTIVE_CART,
            cart: resp.data,
        });
    } catch (err) {
        const items = readLocalCart();
        syncLocalCartState(items, dispatch);
    }
};

export const getCartTotals = () => async (dispatch) => {
    try {
        const cartToken = localStorage.getItem('sc-cart-token');
        const axiosConfig = {
            headers: {
                'x-cart-token': cartToken,
            },
        };

        const resp = await axios.get(`/api/cart/totals`, axiosConfig);

        dispatch({
            type: types.GET_CART_TOTALS,
            total: resp.data,
        });
    } catch (err) {
        const items = readLocalCart();
        const { total } = deriveCartFromLocal(items);

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
    try {
        const cartToken = localStorage.getItem('sc-cart-token');
        const axiosConfig = {
            headers: {
                'x-cart-token': cartToken,
            },
        };

        const res = await axios.post(`/api/orders/guest`, guest, axiosConfig);

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

export const getGuestOrderDetails = (email, orderId) => async (dispatch) => {
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

export const clearProductDetails = () => ({ type: types.CLEAR_PRODUCT_DETAILS });
