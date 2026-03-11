import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import rootReducer from './rootReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: rootReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});