import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSlice } from './slices/ingredients/ingredientsSlice';
import { feedSlice } from './slices/feed/feedSlice';
import { constructorSlice } from './slices/constructor/constructorSlice';
import { orderSlice } from './slices/order/orderSlice';
import { userSlice } from './slices/user/userSlice';

const rootReducer = combineSlices(
  ingredientsSlice,
  feedSlice,
  constructorSlice,
  orderSlice,
  userSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
