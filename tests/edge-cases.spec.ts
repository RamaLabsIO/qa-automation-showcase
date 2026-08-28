import { test, expect, INVENTORY_ITEMS } from '../fixtures/test-fixtures';

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('multiple quantities of different items', async ({ inventoryPage, cartPage }) => {
    // Add all items to cart
    for (const item of Object.values(INVENTORY_ITEMS)) {
      await inventoryPage.addItemToCart(item);
    }
    expect(await inventoryPage.getCartCount()).toBe(6);

    await inventoryPage.openCart();
    expect(await cartPage.getItemCount()).toBe(6);
  });

  test('item persists in cart after navigating away and back', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCart(INVENTORY_ITEMS.onesie);
    await inventoryPage.openCart();
    expect(await cartPage.getItemCount()).toBe(1);

    await cartPage.continueShopping();
    await inventoryPage.openCart();
    expect(await cartPage.getItemCount()).toBe(1);
  });
});