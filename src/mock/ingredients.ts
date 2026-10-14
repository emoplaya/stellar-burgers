import { TIngredient } from '@utils-types';

const IMG = 'https://code.s3.yandex.net/react/code';

const make = (
  _id: string,
  name: string,
  type: 'bun' | 'main' | 'sauce',
  img: string,
  price: number,
  [proteins, fat, carbohydrates, calories]: number[]
): TIngredient => ({
  _id,
  name,
  type,
  proteins,
  fat,
  carbohydrates,
  calories,
  price,
  image: `${IMG}/${img}.png`,
  image_mobile: `${IMG}/${img}-mobile.png`,
  image_large: `${IMG}/${img}-large.png`
});

// тот же набор ингредиентов, что отдает API бургерной
export const mockIngredients: TIngredient[] = [
  make(
    '643d69a5c3f7b9001cfa093c',
    'Краторная булка N-200i',
    'bun',
    'bun-02',
    1255,
    [80, 24, 53, 420]
  ),
  make(
    '643d69a5c3f7b9001cfa093d',
    'Флюоресцентная булка R2-D3',
    'bun',
    'bun-01',
    988,
    [44, 26, 85, 643]
  ),
  make(
    '643d69a5c3f7b9001cfa0941',
    'Биокотлета из марсианской Магнолии',
    'main',
    'meat-01',
    424,
    [420, 142, 242, 4242]
  ),
  make(
    '643d69a5c3f7b9001cfa093e',
    'Филе Люминесцентного тетраодонтимформа',
    'main',
    'meat-03',
    988,
    [44, 26, 85, 643]
  ),
  make(
    '643d69a5c3f7b9001cfa093f',
    'Мясо бессмертных моллюсков Protostomia',
    'main',
    'meat-02',
    1337,
    [433, 244, 33, 420]
  ),
  make(
    '643d69a5c3f7b9001cfa0940',
    'Говяжий метеорит (отбивная)',
    'main',
    'meat-04',
    3000,
    [800, 800, 300, 2674]
  ),
  make(
    '643d69a5c3f7b9001cfa0946',
    'Хрустящие минеральные кольца',
    'main',
    'mineral_rings',
    300,
    [808, 689, 609, 986]
  ),
  make(
    '643d69a5c3f7b9001cfa0947',
    'Плоды Фалленианского дерева',
    'main',
    'sp_1',
    874,
    [20, 5, 55, 77]
  ),
  make(
    '643d69a5c3f7b9001cfa0948',
    'Кристаллы марсианских альфа-сахаридов',
    'main',
    'core',
    762,
    [234, 432, 111, 189]
  ),
  make(
    '643d69a5c3f7b9001cfa0949',
    'Мини-салат Экзо-Плантаго',
    'main',
    'salad',
    4400,
    [1, 2, 3, 6]
  ),
  make(
    '643d69a5c3f7b9001cfa094a',
    'Сыр с астероидной плесенью',
    'main',
    'cheese',
    4142,
    [84432, 48932, 420, 3377]
  ),
  make(
    '643d69a5c3f7b9001cfa0942',
    'Соус Spicy-X',
    'sauce',
    'sauce-02',
    90,
    [30, 20, 40, 30]
  ),
  make(
    '643d69a5c3f7b9001cfa0943',
    'Соус фирменный Space Sauce',
    'sauce',
    'sauce-04',
    80,
    [50, 22, 11, 14]
  ),
  make(
    '643d69a5c3f7b9001cfa0944',
    'Соус традиционный галактический',
    'sauce',
    'sauce-03',
    15,
    [42, 24, 42, 99]
  ),
  make(
    '643d69a5c3f7b9001cfa0945',
    'Соус с шипами Антарианского плоскоходца',
    'sauce',
    'sauce-01',
    88,
    [101, 99, 100, 100]
  )
];
