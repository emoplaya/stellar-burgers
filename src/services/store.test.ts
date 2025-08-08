import { rootReducer } from './store';
import { initialState as ingredientsInitialState } from './slices/ingredients/ingredientsSlice';
import { initialState as feedInitialState } from './slices/feed/feedSlice';
import { initialState as constructorInitialState } from './slices/constructor/constructorSlice';
import { initialState as orderInititalState } from './slices/order/orderSlice';
import { initialState as userInitialState } from './slices/user/userSlice';

const currentState = {
  ingredients: ingredientsInitialState,
  feed: feedInitialState,
  createBurger: constructorInitialState,
  order: orderInititalState,
  user: userInitialState
};

describe('rootReducer', () => {
  test('should return correct initial state', () => {
    const state = rootReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(currentState);
  });

  test('should return current state for unknown action', () => {
    const nextState = rootReducer(currentState, { type: 'UNKNOWN_ACTION' });
    expect(nextState).toBe(currentState);
    expect(nextState).toEqual(currentState);
  });
});
