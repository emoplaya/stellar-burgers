import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearConstructor,
  constructorBunSelector,
  constructorIngredientsSelector
} from '../../services/slices/constructor/constructorSlice';
import {
  clearOrder,
  createOrder,
  orderModalDataSelector,
  orderRequestSelector
} from '../../services/slices/order/orderSlice';
import { useNavigate } from 'react-router-dom';
import { userDataSelector } from '../../../src/services/slices/user/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bun = useSelector(constructorBunSelector);
  const ingredients = useSelector(constructorIngredientsSelector);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderModalDataSelector);
  const currentUser = useSelector(userDataSelector);

  useEffect(() => {
    if (orderModalData) {
      dispatch(clearConstructor());
    }
  }, [orderModalData, dispatch]);

  const onOrderClick = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!bun || orderRequest) return;

    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    dispatch(createOrder(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearOrder());
    navigate('/');
  };

  const price = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum: number, item: TConstructorIngredient) => sum + item.price,
      0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const constructorItems = {
    bun: bun || null,
    ingredients: ingredients || []
  };
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
