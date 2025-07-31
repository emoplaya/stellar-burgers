import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import {
  getProfileOrders,
  profileOrdersSelector
} from '../../../src/services/slices/order/orderSlice';
import { useDispatch, useSelector } from '../../../src/services/store';

export const ProfileOrders: FC = () => {
  const orders = useSelector(profileOrdersSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProfileOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
