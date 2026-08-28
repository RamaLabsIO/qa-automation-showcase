import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly shoppingCartLink: Locator;
  readonly sortDropdown: Locator;
  readonly burgerMenu: Locator;
  readonly logoutLink: Locator;
  readonly sidebar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.getByTestId('inventory-item');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.shoppingCartLink = page.getByTestId('shopping-cart-link');
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.burgerMenu = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
    this.sidebar = page.locator('.bm-menu-wrap');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  async addItemToCart(itemName: string) {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    await item.getByRole('button', { name: /add to cart/i }).click();
  }

  async removeItemFromCart(itemName: string) {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    await item.getByRole('button', { name: /remove/i }).click();
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async getCartCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      return parseInt(await this.cartBadge.textContent() || '0', 10);
    }
    return 0;
  }

  async openCart() {
    await this.shoppingCartLink.click();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
  }

  async logout() {
    await this.burgerMenu.click();
    await this.logoutLink.click();
  }

  async getItemPrices(): Promise<number[]> {
    const prices: number[] = [];
    const priceElements = this.page.locator('.inventory_item_price');
    const count = await priceElements.count();
    for (let i = 0; i < count; i++) {
      const text = await priceElements.nth(i).textContent();
      if (text) prices.push(parseFloat(text.replace('$', '')));
    }
    return prices;
  }

  async getItemNames(): Promise<string[]> {
    const names: string[] = [];
    const nameElements = this.page.locator('.inventory_item_name');
    const count = await nameElements.count();
    for (let i = 0; i < count; i++) {
      const text = await nameElements.nth(i).textContent();
      if (text) names.push(text);
    }
    return names;
  }
}