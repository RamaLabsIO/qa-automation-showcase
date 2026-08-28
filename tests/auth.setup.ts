import { test as setup } from '@playwright/test';
import { USERS } from '../fixtures/test-fixtures';

const AUTH_FILE = 'playwright/.auth/user.json';

setup('authenticate as standard_user', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('username').fill(USERS.standard.username);
  await page.getByTestId('password').fill(USERS.standard.password);
  await page.getByTestId('login-button').click();

  // Wait for the inventory page to confirm login succeeded
  await page.waitForURL(/inventory\.html/);
  await page.getByTestId('inventory-item').first().waitFor();

  // Save signed-in state to reuse across all dependent tests
  await page.context().storageState({ path: AUTH_FILE });
});