import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient,
} from '../constructorSlice';

import type { TConstructorIngredient, TIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
};

const mockIngredient: TIngredient = {
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
};

const mockConstructorBun: TConstructorIngredient = {
  ...mockBun,
  id: 'bun-id-1',
};

const mockConstructorIngredient: TConstructorIngredient = {
  ...mockIngredient,
  id: 'ingredient-id-1',
};

describe('constructorSlice', () => {
  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('должен добавить булку', () => {
    const action = addIngredient(mockBun);
    const result = constructorReducer(undefined, action);

    expect(result.bun).toBeDefined();
    expect(result.bun?.name).toBe('Булка');
    expect(result.ingredients).toEqual([]);
  });

  test('должен заменить булку на новую', () => {
    const prevState = {
      bun: mockConstructorBun,
      ingredients: [],
    };
    const newBun = { ...mockBun, _id: '3', name: 'Другая булка' };
    const action = addIngredient(newBun);
    const result = constructorReducer(prevState, action);

    expect(result.bun?.name).toBe('Другая булка');
    expect(result.ingredients).toEqual([]);
  });

  test('должен добавить начинку', () => {
    const action = addIngredient(mockIngredient);
    const result = constructorReducer(undefined, action);

    expect(result.ingredients.length).toBe(1);
    expect(result.ingredients[0].name).toBe('Котлета');
    expect(result.bun).toBeNull();
  });

  test('должен удалить конкретный экземпляр по id и сохранить другой экземпляр той же начинки', () => {
    const ingredient1: TConstructorIngredient = {
      ...mockIngredient,
      id: 'ingredient-id-1',
    };
    const ingredient2: TConstructorIngredient = {
      ...mockIngredient,
      id: 'ingredient-id-2',
    };

    const prevState = {
      bun: null,
      ingredients: [ingredient1, ingredient2],
    };

    const action = removeIngredient('ingredient-id-1');
    const result = constructorReducer(prevState, action);

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0].id).toBe('ingredient-id-2');
    expect(result.ingredients[0]._id).toBe(mockIngredient._id);
  });

  test('должен переместить ингредиент', () => {
    const ingredient2: TConstructorIngredient = {
      ...mockIngredient,
      _id: '3',
      name: 'Сыр',
      id: 'ingredient-id-2',
    };

    const prevState = {
      bun: null,
      ingredients: [mockConstructorIngredient, ingredient2],
    };

    const action = moveIngredient({ from: 0, to: 1 });
    const result = constructorReducer(prevState, action);

    expect(result.ingredients[0].id).toBe('ingredient-id-2');
    expect(result.ingredients[1].id).toBe('ingredient-id-1');
  });

  test('должен очистить конструктор', () => {
    const prevState = {
      bun: mockConstructorBun,
      ingredients: [mockConstructorIngredient],
    };
    const action = clearConstructor();
    const result = constructorReducer(prevState, action);

    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
  });
});
