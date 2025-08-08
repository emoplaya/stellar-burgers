import {
  feedReducer,
  getFeedOrders,
  initialState,
  feedSelector,
  feedOrdersSelector,
  feedIsLoadingSelector,
  feedErrorSelector
} from './feedSlice';
import { TOrder } from '@utils-types';
import { TFeedsResponse } from '@api';

describe('feedSlice', () => {
  test('should return initial state', () => {
    expect(feedReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('reducers', () => {
    describe('getFeedOrders', () => {
      test('should handle getFeedOrders.pending', () => {
        const action = { type: getFeedOrders.pending.type };
        const state = feedReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          isLoading: true,
          error: null
        });
      });

      test('should handle getFeedOrders.fulfilled', () => {
        const mockResponse: TFeedsResponse = {
          orders: [
            {
              _id: '1',
              ingredients: ['Ингредиент 1', 'Ингредиент 2'],
              status: 'done',
              name: 'Test Order',
              createdAt: '2025-08-08T07:47:36.807Z',
              updatedAt: '2025-08-08T07:47:37.614Z',
              number: 123456
            } as TOrder
          ],
          total: 100,
          totalToday: 10,
          success: true
        };
        const action = {
          type: getFeedOrders.fulfilled.type,
          payload: mockResponse
        };
        const state = feedReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          orders: mockResponse.orders,
          total: mockResponse.total,
          totalToday: mockResponse.totalToday
        });
      });

      test('should handle getFeedOrders.rejected', () => {
        const errorMessage = 'Ошибка при запросе заказов';
        const action = {
          type: getFeedOrders.rejected.type,
          error: { message: errorMessage }
        };
        const state = feedReducer(initialState, action);

        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          error: errorMessage
        });
      });
    });
  });

  describe('selectors', () => {
    const mockState = {
      feed: {
        orders: [
          {
            _id: '1',
            ingredients: ['Ингредиент 1', 'Ингредиент 2'],
            status: 'done',
            name: 'Test Order',
            createdAt: '2025-08-08T07:47:36.807Z',
            updatedAt: '2025-08-08T07:47:37.614Z',
            number: 123456
          } as TOrder
        ],
        total: 100,
        totalToday: 10,
        isLoading: false,
        error: null
      }
    };

    test('feedOrdersSelector should return orders', () => {
      expect(feedOrdersSelector(mockState)).toEqual(mockState.feed.orders);
    });

    test('feedIsLoadingSelector should return isLoading', () => {
      expect(feedIsLoadingSelector(mockState)).toBe(false);
    });

    test('feedErrorSelector should return error', () => {
      expect(feedErrorSelector(mockState)).toBe(null);
    });

    test('feedSelector should return total and totalToday', () => {
      expect(feedSelector(mockState)).toEqual({
        total: 100,
        totalToday: 10
      });
    });
  });
});
