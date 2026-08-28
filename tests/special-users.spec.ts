import { test, expect, USERS, INVENTORY_ITEMS } from '../fixtures/test-fixtures';

/**
 * These tests authenticate as special users (not standard_user), so they
 * cannot reuse the global storageState — each performs its own login.
 */
test.describe('Special Users', () => {
  test('performance_glitch_user still completes login', async ({ loginPage, inventoryPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.performanceGlitch.username, USERS.performanceGlitch.password);
    await expect(inventoryPage.inventoryItems.first()).toBeVisible({ timeout: 15000 });
    await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
  });

  test('problem_user can still add items to cart', async ({ loginPage, inventoryPage, cartPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.problem.username, USERS.problem.password);
    expect(await inventoryPage.getItemCount()).toBe(6);

    await inventoryPage.addItemToCart(INVENTORY_ITEMS.backpack);
    await inventoryPage.openCart();
    expect(await cartPage.getItemCount()).toBe(1);
  });
});