import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeedOrders,
  feedOrdersSelector,
  feedIsLoadingSelector
} from '../../services/slices/feed/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(feedOrdersSelector);
  const isLoading = useSelector(feedIsLoadingSelector);

  useEffect(() => {
    dispatch(getFeedOrders());
  }, [dispatch]);
  if (isLoading) {
    return <Preloader />;
  }
  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeedOrders())} />
  );
};
