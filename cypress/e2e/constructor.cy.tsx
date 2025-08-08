// Добавление ингредиента из списка ингредиентов в конструктор
describe('add ingredients', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  it('should add bun from constructor to order', () => {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-bun-1]')
      .contains('Ингредиент 1')
      .should('exist');
    cy.get('[data-cy=constructor-bun-2]')
      .contains('Ингредиент 1')
      .should('exist');
  });

  it('should add ingredient from constructor to order', () => {
    cy.get('[data-cy=filling-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=constructor-filling-1')
      .contains('Ингредиент 2')
      .should('exist');
  });
});

// Открытие и закрытие модального окна с описанием ингредиента
describe('opening and closing the modal window with the ingredient description', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });
  it('should open ingredient modal', () => {
    cy.get('[data-cy=ingredient-modal]').should('not.exist');
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=ingredient-details]').should('contain', 'Ингредиент 1');
  });
  it('should close ingredient modal on button click', () => {
    cy.get('[data-cy=ingredient-modal]').should('not.exist');
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=close-modal-button]').click();
    cy.contains('Детали ингредиента').should('not.exist');
  });
  it('should close ingredient modal on overlay click', () => {
    cy.get('[data-cy=ingredient-modal]').should('not.exist');
    cy.contains('Ингредиент 1').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('[data-cy=modal-overlay]').click('right', { force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });
  it('should close ingredient modal on esc button click', () => {
    cy.get('[data-cy=ingredient-modal]').should('not.exist');
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
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'post_order.json' }).as(
      'postOrder'
    );
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('test-refreshToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');
    cy.viewport(1300, 800);
    cy.visit('http://localhost:4000');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should order burger', () => {
    cy.get('[data-cy=bun-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=filling-ingredients]').contains('Добавить').click();
    cy.get('[data-cy=order-button]').click();

    cy.get('[data-cy=order-number]').contains('123456').should('exist');
    cy.get('[data-cy=close-modal-button]').click();
    cy.get('[data-cy=order-number]').should('not.exist');

    cy.get('[data-cy=burger-constructor]')
      .contains('Ингредиент 1')
      .should('not.exist');
  });
});
