const testUrl = 'http://localhost:4000';
const ingredientsFixture = { fixture: 'ingredients.json' };
const viewportSettings = { width: 1300, height: 800 };

const bunIngredients = '[data-cy=bun-ingredients]';
const fillingIngredients = '[data-cy=filling-ingredients]';
const constructorBun1 = '[data-cy=constructor-bun-1]';
const constructorBun2 = '[data-cy=constructor-bun-2]';
const constructorFilling = '[data-cy=constructor-filling-1';
const ingredientModal = '[data-cy=ingredient-modal]';
const ingredientDetails = '[data-cy=ingredient-details]';
const closeModalButton = '[data-cy=close-modal-button]';
const modalOverlay = '[data-cy=modal-overlay]';
const orderButton = '[data-cy=order-button]';
const orderNumber = '[data-cy=order-number]';
const burgerConstructor = '[data-cy=burger-constructor]';

// Добавление ингредиента из списка ингредиентов в конструктор
describe('add ingredients', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', ingredientsFixture);
    cy.viewport(viewportSettings.width, viewportSettings.height);
    cy.visit(testUrl);
  });

  it('should add bun from constructor to order', () => {
    cy.get(bunIngredients).contains('Добавить').click();
    cy.get(constructorBun1).contains('Ингредиент 1').should('exist');
    cy.get(constructorBun2).contains('Ингредиент 1').should('exist');
  });

  it('should add ingredient from constructor to order', () => {
    cy.get(fillingIngredients).contains('Добавить').click();
    cy.get(constructorFilling).contains('Ингредиент 2').should('exist');
  });
});

// Открытие и закрытие модального окна с описанием ингредиента
describe('opening and closing the modal window with the ingredient description', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', ingredientsFixture);
    cy.viewport(viewportSettings.width, viewportSettings.height);
    cy.visit(testUrl);
  });
  it('should open ingredient modal', () => {
    cy.get(ingredientModal).should('not.exist');
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get(ingredientDetails).should('contain', 'Ингредиент 1');
  });
  it('should close ingredient modal on button click', () => {
    cy.get(ingredientModal).should('not.exist');
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get(closeModalButton).click();
    cy.contains('Детали ингредиента').should('not.exist');
  });
  it('should close ingredient modal on overlay click', () => {
    cy.get(ingredientModal).should('not.exist');
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get(modalOverlay).click('right', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
  it('should close ingredient modal on esc button click', () => {
    cy.get(ingredientModal).should('not.exist');
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('body').type('{esc}');
    cy.contains('Детали ингредиента').should('not.exist');
  });
});

// Процесс создания заказа: добавление ингредиентов в конструктор бургера
// Проверка отображения модального окна с верным номером заказа при клике на кнопку оформления заказа
// Проверка очистки конструктора бургера от добавленных ингредиентов
describe('order modal', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', ingredientsFixture);
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'post_order.json' }).as(
      'postOrder'
    );
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(viewportSettings.width, viewportSettings.height);
    cy.visit(testUrl);
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should order burger', () => {
    cy.get(bunIngredients).contains('Добавить').click();
    cy.get(fillingIngredients).contains('Добавить').click();
    cy.get(orderButton).click();

    cy.get(orderNumber).contains('123456').should('exist');
    cy.get(closeModalButton).click();
    cy.get(orderNumber).should('not.exist');

    cy.get(burgerConstructor).contains('Ингредиент 1').should('not.exist');
  });
});
