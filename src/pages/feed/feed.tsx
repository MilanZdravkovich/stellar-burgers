import {
  fetchFeeds,
  selectFeedLoading,
  selectFeedOrders,
  wsConnect,
  wsDisconnect,
} from '@slices/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';
import { FEED_WS_URL } from '@utils/constants';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);

  useEffect((): (() => void) => {
    void dispatch(wsConnect(FEED_WS_URL));

    return () => {
      void dispatch(wsDisconnect());
    };
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeeds());
  };

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
