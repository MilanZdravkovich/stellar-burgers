import { expect, test } from '@playwright/test';

import type { Page } from '@playwright/test';

const MOCK_INGREDIENTS = [
  {
    _id: 'bun-1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/demo/0-1.png',
    image_mobile: 'https://code.s3.yandex.net/react/demo/0-1.png',
    image_large: 'https://code.s3.yandex.net/react/demo/0-1.png',
  },
  {
    _id: 'main-1',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/demo/1-1.png',
    image_mobile: 'https://code.s3.yandex.net/react/demo/1-1.png',
    image_large: 'https://code.s3.yandex.net/react/demo/1-1.png',
  },
  {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/demo/2-1.png',
    image_mobile: 'https://code.s3.yandex.net/react/demo/2-1.png',
    image_large: 'https://code.s3.yandex.net/react/demo/2-1.png',
  },
];

const MOCK_USER = {
  success: true,
  user: { email: 'test@test.ru', name: 'Test User' },
};

const MOCK_ORDER = {
  success: true,
  name: 'Test Order',
  order: {
    _id: 'order-1',
    status: 'done',
    name: 'Test Order',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    number: 12345,
    ingredients: ['bun-1', 'main-1', 'bun-1'],
  },
};

const setupMocks = async (page: Page): Promise<void> => {
  await page.route('**/api/ingredients', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: MOCK_INGREDIENTS }),
    });
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_USER),
    });
  });

  await page.route('**/api/orders', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_ORDER),
      });
    } else {
      await route.continue();
    }
  });

  // Моковые токены
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: 'Bearer mock-access-token',
      domain: 'localhost',
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

  test('открытие и закрытие модалки ингредиента по крестику', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();
    await expect(page.getByText('Калории, ккал')).toBeVisible();

    await page.getByLabel('Закрыть').click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).not.toBeVisible();
  });

  test('закрытие модалки ингредиента по оверлею', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();

    await page.locator('[data-testid="modal-overlay"]').click({ position: { x: 10, y: 10 } });

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).not.toBeVisible();
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