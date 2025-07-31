import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

interface IngredientsState {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const ingredients = await getIngredientsApi();
    return ingredients;
  } catch (error) {
    return rejectWithValue(
      (error as Error).message || 'Ошибка при запросе ингредиентов'
    );
  }
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    ingredientsSelector: (state): TIngredient[] => state.ingredients,
    ingredientsLoadingSelector: (state): boolean => state.isLoading,
    ingredientsErrorSelector: (state): string | null => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка при запросе ингредиентов';
      });
  }
});

export const {
  ingredientsSelector,
  ingredientsLoadingSelector,
  ingredientsErrorSelector
} = ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
