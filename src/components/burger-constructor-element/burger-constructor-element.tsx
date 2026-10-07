import { moveIngredient, removeIngredient } from '@slices/constructorSlice';
import { BurgerConstructorElementUI } from '@ui';
import { memo } from 'react';

import { useDispatch } from '@services/store';

import type { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement = memo(function BurgerConstructorElement({
  ingredient,
  index,
  totalItems,
}: BurgerConstructorElementProps): React.JSX.Element {
  const dispatch = useDispatch();

  const handleMoveDown = (): void => {
    if (index < totalItems - 1) {
      dispatch(moveIngredient({ from: index, to: index + 1 }));
    }
  };

  const handleMoveUp = (): void => {
    if (index > 0) {
      dispatch(moveIngredient({ from: index, to: index - 1 }));
    }
  };

  const handleClose = (): void => {
    dispatch(removeIngredient(ingredient.id));
  };

  return (
    <BurgerConstructorElementUI
      ingredient={ingredient}
      index={index}
      totalItems={totalItems}
      handleMoveUp={handleMoveUp}
      handleMoveDown={handleMoveDown}
      handleClose={handleClose}
    />
  );
});
