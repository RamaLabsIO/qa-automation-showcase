import { test, expect, INVENTORY_ITEMS } from '../fixtures/test-fixtures';

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventoryPage }) => {
    await inventoryPage.goto();
    await inventoryPage.addItemToCart(INVENTORY_ITEMS.backpack);
    await inventoryPage.addItemToCart(INVENTORY_ITEMS.fleeceJacket);
  });

  test('complete checkout flow', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillShippingDetails('Damir', 'Rama', '8000');
    await checkoutPage.continue();

    // Verify order summary
    const subtotal = await checkoutPage.getSubtotal();
    expect(subtotal).toContain('79.98');
    const total = await checkoutPage.getTotal();
    expect(total).toContain('86.38');

    await checkoutPage.finishOrder();
    const confirmation = await checkoutPage.getOrderConfirmation();
    expect(confirmation).toContain('Thank you for your order');
  });

  test('can cancel checkout from shipping step', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.cancel();
    await expect(inventoryPage.inventoryItems.first()).toBeVisible();
  });

  test('can cancel checkout from overview step', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingDetails('Damir', 'Rama', '8000');
    await checkoutPage.continue();
    await checkoutPage.cancel();
    await expect(inventoryPage.inventoryItems.first()).toBeVisible();
  });

  test('shows error when first name is missing', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingDetails('', 'Rama', '8000');
    await checkoutPage.continue();
    const error = await checkoutPage.getError();
    expect(error).toContain('First Name is required');
  });

  test('shows error when last name is missing', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingDetails('Damir', '', '8000');
    await checkoutPage.continue();
    const error = await checkoutPage.getError();
    expect(error).toContain('Last Name is required');
  });

  test('shows error when postal code is missing', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingDetails('Damir', 'Rama', '');
    await checkoutPage.continue();
    const error = await checkoutPage.getError();
    expect(error).toContain('Postal Code is required');
  });

  test('back home after completed order works', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingDetails('Damir', 'Rama', '8000');
    await checkoutPage.continue();
    await checkoutPage.finishOrder();
    await checkoutPage.backHome();
    await expect(inventoryPage.inventoryItems.first()).toBeVisible();
  });
});