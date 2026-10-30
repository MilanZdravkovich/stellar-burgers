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

  test('должен установить isLoading = true и сбросить ошибку при pending', () => {
    const prevState = {
      ingredients: [],
      isLoading: false,
      error: 'Предыдущая ошибка',
    };
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(prevState, action);

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('должен сохранить данные и завершить загрузку при fulfilled', () => {
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

    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
  });

  test('должен сохранить ошибку и завершить загрузку при rejected', () => {
    const prevState = {
      ingredients: [],
      isLoading: true,
      error: null,
    };
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сервера' },
    };
    const result = ingredientsReducer(prevState, action);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка сервера');
  });

  test('не должен мутировать предыдущее состояние при fulfilled', () => {
    const prevState = {
      ingredients: [],
      isLoading: true,
      error: 'старая ошибка',
    };
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const result = ingredientsReducer(prevState, action);

    expect(result).not.toBe(prevState);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('старая ошибка');
    expect(prevState.ingredients).toEqual([]);
    expect(prevState.isLoading).toBe(true);
  });
});
