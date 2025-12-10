import types from './types';
import axios from 'axios';
import { findProductById, products as fallbackProducts } from '../data/products';

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
        const product = productFromApi || findProductById(productId);

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
    try {
        
        const cartToken = localStorage.getItem('sc-cart-token');

        const axiosConfig = {
            headers: {
                'x-cart-token': cartToken
            }
        }
        
        const resp = await axios.post(`/api/cart/items/${productId}`, {
            quantity: quantity,
        },
        axiosConfig,
        );

        localStorage.setItem("sc-cart-token", resp.data.cartToken);    

        dispatch({
            type: types.ADD_ITEM_TO_CART,
            cartTotal: resp.data.total,
         });
        //  console.log('Add to cart response:', resp);
    } catch(error){
      //   console.log('Add Item To Cart Error:', error.message);

    }
};



export const getActiveCart = () => async dispatch => {

    try {
        const cartToken = localStorage.getItem('sc-cart-token');

        const axiosConfig = {
            headers: {
                'x-cart-token': cartToken
            }
        }

        const resp = await axios.get(`/api/cart`, axiosConfig);
        // console.log('Get active cart server response:', resp);
        dispatch({
            type: types.GET_ACTIVE_CART,
            cart: resp.data,
         });
        // console.log('Get active cart server response:', resp);
        // console.log('Get active cart action creator');
    } catch(err){
      //   console.log('Get active cart error:', err);
    }
}

export const getCartTotals = () => async dispatch => {
    try {

        const cartToken = localStorage.getItem('sc-cart-token');

        const axiosConfig = {
            headers: {
                'x-cart-token': cartToken
            }
        }

       const resp = await axios.get(`/api/cart/totals`, axiosConfig);

       dispatch({
          type: types.GET_CART_TOTALS,
          total: resp.data,
       });
   //  console.log('Get Totals Response:', resp);
    } catch (err) {
      //   console.log('Error getting cart totals:', err);
    }
 };

 export const createGuestOrder = guest => async dispatch => {
    try {
      // console.log('Create guest order, guest data:', guest);
      const cartToken = localStorage.getItem('sc-cart-token');

      const axiosConfig = {
            headers: {
                'x-cart-token': cartToken
            }
        }
 
      const res = await axios.post(`/api/orders/guest`, guest, axiosConfig);
 
      localStorage.removeItem("sc-cart-token");
 
      dispatch({
         type: types.CREATE_GUEST_ORDER,
         order: {
            id: res.data.id,
            message: res.data.message,
         },
      });
      // console.log('Guest Checkout Response:', res);
      return {
          email: guest.email,
          order_Id: res.data.id,
          
      };
      
   }  catch (err) {
      console.log("Error from Guest checkout", err);
   }
 };
 
 export const getGuestOrderDetails = (email, orderId) => async dispatch => {
    try {
      
      const res = await axios.get(`/api/orders/guest/${orderId}?email=${email}`);
      
      dispatch({
         type: types.GET_GUEST_ORDER_DETAILS,
         details: res.data,
      });
      console.log('OrderDetail actions.js get:', res.data)
    } catch (err) {
      console.log('Error with guest details:', err);
    }
 };



 export const clearProductDetails = () => ({ type: types.CLEAR_PRODUCT_DETAILS });
