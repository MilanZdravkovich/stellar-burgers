import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  wsConnected: boolean;
};

const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
  wsConnected: false,
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async () => await getOrdersApi()
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    wsConnect: (_state, _action: PayloadAction<string>) => {
      // Middleware сам устанавливает соединение
    },
    wsDisconnect: (state) => {
      state.wsConnected = false;
    },
    wsOpen: (state) => {
      state.wsConnected = true;
      state.error = null;
    },
    wsClose: (state) => {
      state.wsConnected = false;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.wsConnected = false;
    },
    wsMessage: (state, action: PayloadAction<{ orders: TOrder[] }>) => {
      state.orders = Array.isArray(action.payload?.orders) ? action.payload.orders : [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки истории заказов';
      });
  },
});

export const ordersReducer = ordersSlice.reducer;

export const {
  wsConnect: userWsConnect,
  wsDisconnect: userWsDisconnect,
  wsOpen: userWsOpen,
  wsClose: userWsClose,
  wsError: userWsError,
  wsMessage: userWsMessage,
} = ordersSlice.actions;

export const selectUserOrders = (state: { orders: TOrdersState }): TOrder[] =>
  state.orders.orders;
export const selectOrdersLoading = (state: { orders: TOrdersState }): boolean =>
  state.orders.isLoading;
export const selectOrdersWsConnected = (state: { orders: TOrdersState }): boolean =>
  state.orders.wsConnected;
