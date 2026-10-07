import { getCookie } from '@/utils/cookie';
import {
  fetchUserOrders,
  selectOrdersLoading,
  selectUserOrders,
  userWsConnect,
  userWsDisconnect,
} from '@slices/ordersSlice';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';
import { USER_ORDERS_WS_URL } from '@utils/constants';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectOrdersLoading);

  useEffect((): (() => void) => {
    void dispatch(fetchUserOrders());

    const token = getCookie('accessToken')?.replace('Bearer ', '');
    if (token) {
      void dispatch(userWsConnect(`${USER_ORDERS_WS_URL}?token=${token}`));
    }

    return () => {
      void dispatch(userWsDisconnect());
    };
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
