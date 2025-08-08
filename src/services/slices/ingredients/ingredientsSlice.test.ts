import {
  ingredientsSlice,
  initialState,
  fetchIngredients
} from './ingredientsSlice';

import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Ингредиент 1',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '2',
    name: 'Ингредиент 2',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }
];

describe('ingredientsSlice', () => {
  test('should return initial state', () => {
    expect(ingredientsSlice.reducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('reducers', () => {
    describe('fetchIngredients', () => {
      test('should handle fetchIngredients.pending', () => {
        const state = ingredientsSlice.reducer(
          { ...initialState, error: 'Test error' },
          fetchIngredients.pending('')
        );
        expect(state).toEqual({
          ...initialState,
          isLoading: true,
          error: null
        });
      });

      test('should handle fetchIngredients.fulfilled', () => {
        const state = ingredientsSlice.reducer(
          { ...initialState, isLoading: true },
          fetchIngredients.fulfilled(mockIngredients, '')
        );
        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          ingredients: mockIngredients
        });
      });

      test('should handle fetchIngredients.rejected', () => {
        const errorMessage = 'Failed to fetch ingredients';
        const state = ingredientsSlice.reducer(
          { ...initialState, isLoading: true },
          fetchIngredients.rejected(
            new Error(errorMessage),
            '',
            undefined,
            errorMessage
          )
        );
        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          error: errorMessage
        });
      });
    });
  });

  describe('selectors', () => {
    const testState = {
      ingredients: {
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      }
    };

    test('ingredientsSelector should return ingredients', () => {
      expect(ingredientsSlice.selectors.ingredientsSelector(testState)).toEqual(
        mockIngredients
      );
    });

    test('ingredientsLoadingSelector should return loading', () => {
      expect(
        ingredientsSlice.selectors.ingredientsLoadingSelector(testState)
      ).toBe(false);
    });

    test('ingredientsErrorSelector should return error', () => {
      const errorState = {
        ingredients: {
          ...testState.ingredients,
          error: 'Test error'
        }
      };
      expect(
        ingredientsSlice.selectors.ingredientsErrorSelector(errorState)
      ).toBe('Test error');
    });
  });
});
