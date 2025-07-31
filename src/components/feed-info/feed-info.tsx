import { FC, useMemo } from 'react';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  feedOrdersSelector,
  feedSelector
} from '../../services/slices/feed/feedSlice';

const getOrdersData = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const orders = useSelector(feedOrdersSelector);
  const feed = useSelector(feedSelector);

  const readyOrders = useMemo(() => getOrdersData(orders, 'done'), [orders]);
  const pendingOrders = useMemo(
    () => getOrdersData(orders, 'pending'),
    [orders]
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
