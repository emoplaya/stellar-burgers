import {
  orderReducer,
  initialState,
  createOrder,
  getOrderByNumber,
  getProfileOrders,
  clearOrder,
  orderRequestSelector,
  orderModalDataSelector,
  orderErrorSelector,
  profileOrdersSelector,
  profileOrdersLoadingSelector
} from './orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  ingredients: ['Ингредиент 1', 'Ингредиент 2'],
  status: 'done',
  name: 'Test Order',
  createdAt: '2025-08-08T07:47:36.807Z',
  updatedAt: '2025-08-08T07:47:37.614Z',
  number: 123456
};
const mockProfileOrders: TOrder[] = [
  mockOrder,
  {
    ...mockOrder,
    _id: '2',
    number: 567890,
    status: 'pending'
  }
];

describe('orderSlice', () => {
  test('should return initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('reducers', () => {
    test('should handle clearOrder', () => {
      const stateWithOrder = {
        ...initialState,
        orderModalData: mockOrder,
        error: 'Test error'
      };
      const state = orderReducer(stateWithOrder, clearOrder());
      expect(state.orderModalData).toBeNull();
      expect(state.error).toBeNull();
    });

    describe('createOrder', () => {
      test('should handle createOrder.pending', () => {
        const state = orderReducer(initialState, createOrder.pending('', []));
        expect(state).toEqual({
          ...initialState,
          orderRequest: true,
          error: null
        });
      });

      test('should handle createOrder.fulfilled', () => {
        const pendingState = orderReducer(
          initialState,
          createOrder.pending('', [])
        );
        const state = orderReducer(
          pendingState,
          createOrder.fulfilled(mockOrder, '', [])
        );

        expect(state).toEqual({
          ...initialState,
          orderRequest: false,
          orderModalData: mockOrder
        });
      });

      test('should handle createOrder.rejected', () => {
        const pendingState = orderReducer(
          initialState,
          createOrder.pending('', [])
        );
        const error = 'Ошибка создания заказа';
        const state = orderReducer(
          pendingState,
          createOrder.rejected(new Error(error), '', [])
        );

        expect(state).toEqual({
          ...initialState,
          orderRequest: false,
          error: error
        });
      });
    });

    describe('getOrderByNumber', () => {
      test('should handle getOrderByNumber.pending', () => {
        const stateWithError = { ...initialState, error: 'Test error' };
        const state = orderReducer(
          stateWithError,
          getOrderByNumber.pending('', 123456)
        );
        expect(state.error).toBeNull();
      });

      test('should handle getOrderByNumber.fulfilled', () => {
        const state = orderReducer(
          initialState,
          getOrderByNumber.fulfilled(mockOrder, '', 123456)
        );
        expect(state.orderModalData).toEqual(mockOrder);
      });

      test('should handle getOrderByNumber.rejected', () => {
        const error = 'Заказ не найден';
        const state = orderReducer(
          initialState,
          getOrderByNumber.rejected(new Error(error), '', 123456)
        );
        expect(state.error).toBe(error);
      });
    });

    describe('getProfileOrders', () => {
      test('should handle getProfileOrders.pending', () => {
        const state = orderReducer(initialState, getProfileOrders.pending(''));
        expect(state).toEqual({
          ...initialState,
          profileOrdersLoading: true,
          error: null
        });
      });

      test('should handle getProfileOrders.fulfilled', () => {
        const pendingState = orderReducer(
          initialState,
          getProfileOrders.pending('')
        );
        const state = orderReducer(
          pendingState,
          getProfileOrders.fulfilled(mockProfileOrders, '')
        );

        expect(state).toEqual({
          ...initialState,
          profileOrdersLoading: false,
          profileOrders: mockProfileOrders
        });
      });

      test('should handle getProfileOrders.rejected', () => {
        const pendingState = orderReducer(
          initialState,
          getProfileOrders.pending('')
        );
        const error = 'Не удалось запросить заказы';
        const state = orderReducer(
          pendingState,
          getProfileOrders.rejected(new Error(error), '')
        );

        expect(state).toEqual({
          ...initialState,
          profileOrdersLoading: false,
          error: error
        });
      });
    });
  });

  describe('selectors', () => {
    const testState = {
      order: {
        orderRequest: true,
        orderModalData: mockOrder,
        profileOrders: mockProfileOrders,
        profileOrdersLoading: false,
        error: null
      }
    };

    test('orderRequestSelector should return request status', () => {
      expect(orderRequestSelector(testState)).toBe(true);
    });

    test('orderModalDataSelector should return order data', () => {
      expect(orderModalDataSelector(testState)).toEqual(mockOrder);
    });

    test('profileOrdersSelector should return orders', () => {
      expect(profileOrdersSelector(testState)).toEqual(mockProfileOrders);
    });

    test('profileOrdersLoadingSelector should return loading', () => {
      expect(profileOrdersLoadingSelector(testState)).toBe(false);
    });

    test('orderErrorSelector should return error', () => {
      const errorState = {
        order: {
          ...testState.order,
          error: 'Test error'
        }
      };
      expect(orderErrorSelector(errorState)).toBe('Test error');
    });
  });
});
