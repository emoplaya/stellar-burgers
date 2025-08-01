import { FC, useEffect, useMemo, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { ingredientsSelector } from '../../../src/services/slices/ingredients/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { getOrderByNumberApi } from '@api';

interface OrderInfoProps {
  title?: string;
}

export const OrderInfo: FC<OrderInfoProps> = ({ title }) => {
  const { number } = useParams();
  const orderNumber = number ? parseInt(number, 10) : null;

  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const ingredients = useSelector(ingredientsSelector);

  useEffect(() => {
    if (!orderNumber) return;

    getOrderByNumberApi(orderNumber)
      .then((res) => {
        const order = res.orders?.[0];
        if (order) {
          setOrderData(order);
        }
      })
      .catch((err) => console.error(err));
  }, [orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} title={title} />;
};
