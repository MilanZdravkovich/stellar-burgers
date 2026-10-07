import { configureStore } from '@reduxjs/toolkit';
import { useDispatch as dispatchHook, useSelector as selectorHook } from 'react-redux';

import { createSocketMiddleware } from './middleware/socketMiddleware';
import { rootReducer } from './rootReducer';
import {
  wsConnect,
  wsClose,
  wsDisconnect,
  wsError,
  wsMessage,
  wsOpen,
} from './slices/feedSlice';
import {
  userWsConnect,
  userWsDisconnect,
  userWsOpen,
  userWsClose,
  userWsError,
  userWsMessage,
} from './slices/ordersSlice';

const feedSocketMiddleware = createSocketMiddleware({
  wsConnect,
  wsDisconnect,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
});

const userOrdersSocketMiddleware = createSocketMiddleware({
  wsConnect: userWsConnect,
  wsDisconnect: userWsDisconnect,
  wsOpen: userWsOpen,
  wsClose: userWsClose,
  wsError: userWsError,
  wsMessage: userWsMessage,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedSocketMiddleware, userOrdersSocketMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
