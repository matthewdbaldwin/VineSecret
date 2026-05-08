import { combineReducers } from 'redux';
import productReducer from './products_reducer';
import cartReducer from './cart_reducer';
import ordersReducer from './orders_reducer';

const rootReducer = combineReducers({
    products: productReducer,
    cart: cartReducer,
    orders: ordersReducer,
});

export default rootReducer;
