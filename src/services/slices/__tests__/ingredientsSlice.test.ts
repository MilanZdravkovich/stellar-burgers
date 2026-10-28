import { fetchIngredients, ingredientsReducer } from '../ingredientsSlice';

import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'image.png',
    image_large: 'image_large.png',
    image_mobile: 'image_mobile.png',
  },
  {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    price: 200,
    image: 'image.png',
    image_large: 'image_large.png',
    image_mobile: 'image_mobile.png',
  },
];

describe('ingredientsSlice', () => {
  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('должен установить isLoading = true при pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(undefined, action);

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('должен сохранить данные при fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const result = ingredientsReducer(undefined, action);

    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
  });

  test('должен сохранить ошибку при rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сервера' },
    };
    const result = ingredientsReducer(undefined, action);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка сервера');
  });

  test('не должен мутировать предыдущее состояние при fulfilled', () => {
    const prevState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const result = ingredientsReducer(prevState, action);

    expect(result).not.toBe(prevState);
    expect(prevState.ingredients).toEqual([]);
  });
});
