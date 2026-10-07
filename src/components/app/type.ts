import type { TIngredient } from '@utils-types';

export type AppContentProps = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};
