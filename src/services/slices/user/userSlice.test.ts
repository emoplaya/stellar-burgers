import {
  initialState,
  registerUser,
  loginUser,
  getUser,
  updateUser,
  logoutUser,
  authChecked,
  userLogout,
  clearError,
  userReducer,
  userDataSelector,
  isAuthCheckedSelector,
  isUserLoadingSelector,
  userErrorSelector
} from './userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'testuser@example.com',
  name: 'Test User'
};

describe('userSlice', () => {
  test('should return initial state', () => {
    expect(userReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('reducers', () => {
    test('should handle authChecked', () => {
      const state = userReducer(initialState, authChecked());
      expect(state).toEqual({
        ...initialState,
        isAuthChecked: true
      });
    });

    test('should handle userLogout', () => {
      const stateUser = { ...initialState, user: mockUser };
      const state = userReducer(stateUser, userLogout());
      expect(state.user).toBeNull();
    });

    test('should handle clearError', () => {
      const stateError = { ...initialState, error: 'Ошибка' };
      const state = userReducer(stateError, clearError());
      expect(state.error).toBeNull();
    });

    describe('registerUser', () => {
      test('should handle registerUser.pending', () => {
        const state = userReducer(
          initialState,
          registerUser.pending('', {} as any)
        );
        expect(state).toEqual({
          ...initialState,
          isLoading: true,
          error: null
        });
      });

      test('should handle registerUser.fulfilled', () => {
        const pendingState = userReducer(
          initialState,
          registerUser.pending('', {} as any)
        );
        const state = userReducer(
          pendingState,
          registerUser.fulfilled(mockUser, '', {} as any)
        );
        expect(state).toEqual({
          ...initialState,
          isLoading: false,
          user: mockUser
        });
      });

      test('should handle registerUser.rejected', () => {
        const action = {
          type: registerUser.rejected.type,
          payload: 'Ошибка регистрации'
        };
        const state = userReducer({ ...initialState, isLoading: true }, action);
        expect(state.error).toBe('Ошибка регистрации');
      });
    });

    describe('loginUser', () => {
      test('should handle loginUser.pending', () => {
        const state = userReducer(
          initialState,
          loginUser.pending('', {} as any)
        );
        expect(state).toEqual({
          ...initialState,
          isLoading: true,
          error: null
        });
      });

      test('should handle loginUser.fulfilled', () => {
        const state = userReducer(
          { ...initialState, isLoading: true },
          loginUser.fulfilled(mockUser, '', {} as any)
        );
        expect(state).toEqual({
          ...initialState,
          user: mockUser,
          isLoading: false
        });
      });

      test('should handle loginUser.rejected', () => {
        const action = {
          type: loginUser.rejected.type,
          payload: 'Ошибка входа'
        };
        const state = userReducer({ ...initialState, isLoading: true }, action);
        expect(state.error).toBe('Ошибка входа');
      });
    });

    describe('getUser', () => {
      test('should handle getUser.pending', () => {
        const state = userReducer(initialState, getUser.pending('', {} as any));
        expect(state.isLoading).toBe(true);
      });

      test('should handle getUser.fulfilled', () => {
        const state = userReducer(
          { ...initialState, isLoading: true },
          getUser.fulfilled(mockUser, '', {} as any)
        );
        expect(state.user).toEqual(mockUser);
        expect(state.isLoading).toBe(false);
      });

      test('should handle getUser.rejected', () => {
        const action = {
          type: getUser.rejected.type,
          payload: 'Не удалось получить данные пользователя'
        };
        const state = userReducer(
          { ...initialState, isLoading: true, user: mockUser },
          action
        );
        expect(state.user).toBeNull();
        expect(state.error).toBe('Не удалось получить данные пользователя');
      });
    });

    describe('updateUser', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      test('should handle updateUser.pending', () => {
        const state = userReducer(
          initialState,
          updateUser.pending('', {} as any)
        );
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      test('should handle updateUser.fulfilled', () => {
        const state = userReducer(
          { ...initialState, isLoading: true },
          updateUser.fulfilled(updatedUser, '', {} as any)
        );
        expect(state.user).toEqual(updatedUser);
        expect(state.isLoading).toBe(false);
      });

      test('should handle updateUser.rejected', () => {
        const action = {
          type: updateUser.rejected.type,
          payload: 'Не удалось обновить профиль'
        };
        const state = userReducer({ ...initialState, isLoading: true }, action);
        expect(state.error).toBe('Не удалось обновить профиль');
      });
    });

    describe('logoutUser', () => {
      test('should handle logoutUser.fulfilled', () => {
        const state = userReducer(
          { ...initialState, user: mockUser },
          logoutUser.fulfilled(undefined, '', {} as any)
        );
        expect(state.user).toBeNull();
      });
    });
  });

  describe('selectors', () => {
    const testState = {
      user: {
        user: mockUser,
        isAuthChecked: true,
        isLoading: false,
        error: null
      }
    };

    test('userDataSelector should return user data', () => {
      expect(userDataSelector(testState)).toEqual(mockUser);
    });

    test('isAuthCheckedSelector should return auth status', () => {
      expect(isAuthCheckedSelector(testState)).toBe(true);
    });

    test('isUserLoadingSelector should return loading', () => {
      expect(isUserLoadingSelector(testState)).toBe(false);
    });

    test('userErrorSelector should return error', () => {
      const errorState = {
        user: {
          ...testState.user,
          error: 'Test error'
        }
      };
      expect(userErrorSelector(errorState)).toBe('Test error');
    });
  });
});
