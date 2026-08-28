import { test, expect, USERS } from '../fixtures/test-fixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('successful login with standard user', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(inventoryPage.inventoryItems.first()).toBeVisible();
    await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
  });

  test('login fails with locked_out_user', async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut.username, USERS.lockedOut.password);
    expect(await loginPage.isErrorVisible()).toBe(true);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('locked out');
  });

  test('login fails with empty credentials', async ({ loginPage }) => {
    await loginPage.login('', '');
    expect(await loginPage.isErrorVisible()).toBe(true);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username is required');
  });

  test('login fails with wrong password', async ({ loginPage }) => {
    await loginPage.login(USERS.standard.username, 'wrong_password');
    expect(await loginPage.isErrorVisible()).toBe(true);
    const error = await loginPage.getErrorMessage();
    expect(error).toContain('do not match');
  });

  test('error message can be dismissed', async ({ loginPage }) => {
    await loginPage.login('', '');
    expect(await loginPage.isErrorVisible()).toBe(true);
    await loginPage.closeError();
    expect(await loginPage.isErrorVisible()).toBe(false);
  });

  test('logout returns to login page', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard.username, USERS.standard.password);
    await expect(inventoryPage.inventoryItems.first()).toBeVisible();

    await inventoryPage.logout();

    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.page).toHaveURL('/');
  });
});