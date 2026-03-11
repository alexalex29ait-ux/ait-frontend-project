import { combineReducers } from 'redux';
import productReducer from './slices/productSlice';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  products: productReducer,
   auth: authReducer
});

export default rootReducer;