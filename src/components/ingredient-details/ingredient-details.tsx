import { FC } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { TIngredient } from '@utils-types';
import { ingredientsSelector } from '../../../src/services/slices/ingredients/ingredientsSlice';

interface IngredientDetailsProps {
  title?: string;
}
export const IngredientDetails: FC<IngredientDetailsProps> = ({ title }) => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector(ingredientsSelector);

  const ingredientData = ingredients.find(
    (item: TIngredient) => item._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} title={title} />;
};
