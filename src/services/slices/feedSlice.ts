import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TOrdersData } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  wsConnected: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  wsConnected: false,
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
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
    wsMessage: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки ленты';
      });
  },
});

export const feedReducer = feedSlice.reducer;

export const { wsConnect, wsDisconnect, wsOpen, wsClose, wsError, wsMessage } =
  feedSlice.actions;

export const selectFeedOrders = (state: { feed: TFeedState }): TOrder[] =>
  state.feed.orders;
export const selectFeedTotal = (state: { feed: TFeedState }): number => state.feed.total;
export const selectFeedTotalToday = (state: { feed: TFeedState }): number =>
  state.feed.totalToday;
export const selectFeedLoading = (state: { feed: TFeedState }): boolean =>
  state.feed.isLoading;
export const selectFeedWsConnected = (state: { feed: TFeedState }): boolean =>
  state.feed.wsConnected;
