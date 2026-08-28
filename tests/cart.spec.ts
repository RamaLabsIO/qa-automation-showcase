import { test, expect, INVENTORY_ITEMS } from '../fixtures/test-fixtures';

test.describe('Cart', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
  });

  test('added items appear in cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCart(INVENTORY_ITEMS.backpack);
    await inventoryPage.addItemToCart(INVENTORY_ITEMS.boltShirt);
    await inventoryPage.openCart();

    const itemNames = await cartPage.getItemNames();
    expect(itemNames).toContain(INVENTORY_ITEMS.backpack);
    expect(itemNames).toContain(INVENTORY_ITEMS.boltShirt);
    expect(await cartPage.getItemCount()).toBe(2);
  });

  test('can remove item from cart page', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCart(INVENTORY_ITEMS.backpack);
    await inventoryPage.addItemToCart(INVENTORY_ITEMS.bikeLight);
    await inventoryPage.openCart();

    await cartPage.removeItem(INVENTORY_ITEMS.backpack);
    expect(await cartPage.getItemCount()).toBe(1);

    const itemNames = await cartPage.getItemNames();
    expect(itemNames).not.toContain(INVENTORY_ITEMS.backpack);
    expect(itemNames).toContain(INVENTORY_ITEMS.bikeLight);
  });

  test('continue shopping returns to inventory', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addItemToCart(INVENTORY_ITEMS.backpack);
    await inventoryPage.openCart();
    await cartPage.continueShopping();
    await expect(inventoryPage.inventoryItems.first()).toBeVisible();
    await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
  });

  test('empty cart shows no items', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.openCart();
    expect(await cartPage.getItemCount()).toBe(0);
  });
});