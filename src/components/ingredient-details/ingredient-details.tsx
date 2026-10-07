import { selectIngredients } from '@slices/ingredientsSlice';
import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';

import { useSelector } from '@services/store';

export const IngredientDetails = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector(selectIngredients);

  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
