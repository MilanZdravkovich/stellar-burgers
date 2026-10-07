import { OrderInfo } from '@components';

import styles from './order-info-page.module.css';

export const OrderInfoPage = (): React.JSX.Element => (
  <div className={styles.container}>
    <OrderInfo />
  </div>
);
