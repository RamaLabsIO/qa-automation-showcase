import { test, expect, INVENTORY_ITEMS } from '../fixtures/test-fixtures';

test.describe('Products', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('displays all 6 inventory items', async ({ inventoryPage }) => {
    const count = await inventoryPage.getItemCount();
    expect(count).toBe(6);
  });

  test('can add item to cart and badge updates', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(INVENTORY_ITEMS.backpack);
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(1);

    await inventoryPage.addItemToCart(INVENTORY_ITEMS.bikeLight);
    expect(await inventoryPage.getCartCount()).toBe(2);
  });

  test('can remove item from cart from inventory page', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart(INVENTORY_ITEMS.backpack);
    expect(await inventoryPage.getCartCount()).toBe(1);

    await inventoryPage.removeItemFromCart(INVENTORY_ITEMS.backpack);
    expect(await inventoryPage.getCartCount()).toBe(0);
  });

  test('sort by price low to high works', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getItemPrices();
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1]);
    }
  });

  test('sort by price high to low works', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getItemPrices();
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i - 1]);
    }
  });

  test('sort by name A to Z works', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('sort by name Z to A works', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('logout returns to login page', async ({ inventoryPage, loginPage }) => {
    await inventoryPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.page).toHaveURL('/');
  });
});