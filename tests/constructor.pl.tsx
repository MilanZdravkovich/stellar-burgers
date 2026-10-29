import { expect, test } from '@playwright/test';

import type { Page } from '@playwright/test';

const setupMocks = async (page: Page): Promise<void> => {
  // Подмена всех запросов к API через HAR
  await page.routeFromHAR('tests/hars/mocks.har', {
    url: '**/api/**',
    update: false,
    notFound: 'abort',
  });

  // Моковые токены
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer mock-access-token',
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'accessToken',
      value: 'Bearer mock-access-token',
      domain: 'norma.education-services.ru',
      path: '/',
    },
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'mock-refresh-token');
  });
};

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await setupMocks(page);
    await page.goto('/');
    await page.waitForSelector('[data-testid="constructor"]');
  });

  test('добавление булки в конструктор', async ({ page }) => {
    const bunCards = page.locator('li', { hasText: 'Краторная булка N-200i' });
    await bunCards.first().getByText('Добавить').click();

    await expect(page.locator('[data-testid="constructor-bun-1"]')).toBeVisible();
    await expect(page.locator('[data-testid="constructor-bun-2"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="constructor-bun-1"]')
    ).toContainText('Краторная булка N-200i');
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    const mainCards = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии',
    });
    await mainCards.first().getByText('Добавить').click();

    await expect(
      page.locator('[data-testid="constructor-ingredients"]')
    ).toContainText('Биокотлета из марсианской Магнолии');
  });

  test('в модалке отображаются данные ингредиента, по которому кликнули', async ({
    page,
  }) => {
    await page.getByText('Биокотлета из марсианской Магнолии').first().click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();

    const modal = page.locator('div[class*="modal__modal"]');

    await expect(
      modal.getByRole('heading', { name: 'Биокотлета из марсианской Магнолии' })
    ).toBeVisible();
    await expect(modal).toContainText('4242'); // калории
    await expect(modal).toContainText('420'); // белки
    await expect(modal).toContainText('142'); // жиры
    await expect(modal).toContainText('242'); // углеводы
  });

  test('закрытие модалки ингредиента по крестику', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

    await page.getByLabel('Закрыть').click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).not.toBeVisible();
  });

  test('закрытие модалки ингредиента по оверлею', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

    await page.locator('[data-testid="modal-overlay"]').click({ position: { x: 10, y: 10 } });

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).not.toBeVisible();
  });

  test('создание заказа и проверка модалки', async ({ page }) => {
    // Собираем бургер
    const bunCards = page.locator('li', { hasText: 'Краторная булка N-200i' });
    await bunCards.first().getByText('Добавить').click();

    const mainCards = page.locator('li', {
      hasText: 'Биокотлета из марсианской Магнолии',
    });
    await mainCards.first().getByText('Добавить').click();

    // Оформляем заказ
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    // Проверяем модалку
    await expect(page.locator('[data-testid="order-number"]')).toHaveText('12345');

    // Закрываем модалку
    await page.getByLabel('Закрыть').click();

    await expect(page.locator('[data-testid="order-number"]')).not.toBeVisible();

    // Проверяем, что конструктор пуст
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
  });
});