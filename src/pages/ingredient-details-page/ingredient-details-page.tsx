import { IngredientDetails } from '@components';

import styles from './ingredient-details-page.module.css';

export const IngredientDetailsPage = (): React.JSX.Element => (
  <div className={styles.container}>
    <h2 className={`text text_type_main-large ${styles.title}`}>Детали ингредиента</h2>
    <IngredientDetails />
  </div>
);
