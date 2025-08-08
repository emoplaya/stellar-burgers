import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null
};

export const getFeedOrders = createAsyncThunk(
  'feed/getFeedOrders',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    feedSelector: (state) => ({
      total: state.total,
      totalToday: state.totalToday
    }),
    feedOrdersSelector: (state) => state.orders,
    feedIsLoadingSelector: (state) => state.isLoading,
    feedErrorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeedOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeedOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при запросе заказов';
      });
  }
});
export const {
  feedOrdersSelector,
  feedIsLoadingSelector,
  feedErrorSelector,
  feedSelector
} = feedSlice.selectors;

export const feedReducer = feedSlice.reducer;
