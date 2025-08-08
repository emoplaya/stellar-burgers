import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  profileOrders: TOrder[];
  profileOrdersLoading: boolean;
  error: string | null;
}

export const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  profileOrders: [],
  profileOrdersLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    if (!response.orders || response.orders.length === 0) {
      throw new Error('Заказ не найден');
    }

    return response.orders[0];
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || 'Не удалось запросить заказы'
    );
  }
});

export const getProfileOrders = createAsyncThunk(
  'order/getProfileOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders: TOrder[] = await getOrdersApi();
      return orders;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.error = null;
    }
  },
  selectors: {
    orderRequestSelector: (state) => state.orderRequest,
    orderModalDataSelector: (state) => state.orderModalData,
    orderErrorSelector: (state) => state.error,
    profileOrdersSelector: (state) => state.profileOrders,
    profileOrdersLoadingSelector: (state) => state.profileOrdersLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка создания заказа';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderModalData = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Не удалось загрузить заказ';
      })
      .addCase(getProfileOrders.pending, (state) => {
        state.profileOrdersLoading = true;
        state.error = null;
      })
      .addCase(getProfileOrders.fulfilled, (state, action) => {
        state.profileOrdersLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(getProfileOrders.rejected, (state, action) => {
        state.profileOrdersLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Не удалось загрузить историю заказов';
      });
  }
});

export const {
  orderRequestSelector,
  orderModalDataSelector,
  orderErrorSelector,
  profileOrdersSelector,
  profileOrdersLoadingSelector
} = orderSlice.selectors;
export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
