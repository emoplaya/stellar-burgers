import {
  constructorReducer,
  initialState,
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  constructorBunSelector,
  constructorIngredientsSelector
} from './constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: '1',
  name: 'булка',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockFillingIngredient: TIngredient = {
  _id: '2',
  name: 'Начинка',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

describe('constructorSlice', () => {
  test('should return initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('reducers', () => {
    test('should handle addBun', () => {
      const action = addBun(mockBun);
      const state = constructorReducer(initialState, action);
      expect(state.bun).toEqual(mockBun);
    });

    test('should handle addIngredient with id', () => {
      const action = addIngredient(mockFillingIngredient);
      const state = constructorReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockFillingIngredient,
        id: expect.any(String)
      });
    });

    test('should handle removeIngredient', () => {
      const addedAction = addIngredient(mockFillingIngredient);
      let state = constructorReducer(initialState, addedAction);
      const ingredientId = state.ingredients[0].id;

      const removeAction = removeIngredient(ingredientId);
      state = constructorReducer(state, removeAction);

      expect(state.ingredients).toHaveLength(0);
    });

    test('should handle moveIngredient', () => {
      let state = constructorReducer(
        initialState,
        addIngredient({
          ...mockFillingIngredient,
          _id: '1'
        })
      );
      state = constructorReducer(
        state,
        addIngredient({
          ...mockFillingIngredient,
          _id: '2'
        })
      );
      state = constructorReducer(
        state,
        addIngredient({
          ...mockFillingIngredient,
          _id: '3'
        })
      );

      const initialIds = state.ingredients.map((i) => i._id);
      expect(initialIds).toEqual(['1', '2', '3']);

      const moveAction = moveIngredient({ fromIndex: 0, toIndex: 1 });
      state = constructorReducer(state, moveAction);

      const movedIds = state.ingredients.map((i) => i._id);
      expect(movedIds).toEqual(['2', '1', '3']);
    });

    test('should handle clearConstructor', () => {
      let state = constructorReducer(initialState, addBun(mockBun));
      state = constructorReducer(state, addIngredient(mockFillingIngredient));

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).not.toHaveLength(0);

      state = constructorReducer(state, clearConstructor());
      expect(state).toEqual(initialState);
    });
  });

  describe('selectors', () => {
    const testState = {
      createBurger: {
        bun: mockBun,
        ingredients: [
          { ...mockFillingIngredient, id: '1' },
          { ...mockFillingIngredient, id: '2' }
        ]
      }
    };

    test('constructorBunSelector should return bun', () => {
      expect(constructorBunSelector(testState)).toEqual(mockBun);
    });

    test('constructorIngredientsSelector should return ingredients', () => {
      expect(constructorIngredientsSelector(testState)).toEqual(
        testState.createBurger.ingredients
      );
    });
  });
});
