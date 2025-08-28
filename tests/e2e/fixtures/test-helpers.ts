import { Page, expect } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  async waitForAPIResponse(url: string, expectedStatus: number = 200) {
    const response = await this.page.waitForResponse(response => 
      response.url().includes(url) && response.status() === expectedStatus
    );
    return response;
  }

  async checkServerStatus(baseURL: string) {
    try {
      const response = await this.page.request.get(`${baseURL}/health`);
      return response.ok();
    } catch (error) {
      return false;
    }
  }

  async loginUser(email: string, password: string) {
    await this.page.goto('/login');
    await this.page.fill('input[type="email"]', email);
    await this.page.fill('input[type="password"]', password);
    await this.page.click('button[type="submit"]');
    
    // Wait for successful login (redirect or success message)
    await this.page.waitForURL(/\/dashboard|\/profile|\//, { timeout: 10000 });
  }

  async logoutUser() {
    await this.page.click('[data-testid="logout-button"]');
    await this.page.waitForURL('/login');
  }

  async addProductToCart(productId: string) {
    await this.page.goto(`/shop/product/${productId}`);
    await this.page.click('[data-testid="add-to-cart-button"]');
    
    // Wait for cart update confirmation
    await expect(this.page.locator('[data-testid="cart-count"]')).toBeVisible();
  }

  async proceedToCheckout() {
    await this.page.goto('/cart');
    await this.page.click('[data-testid="checkout-button"]');
    await this.page.waitForURL('/checkout');
  }

  async fillShippingAddress(address: any) {
    await this.page.fill('[name="street"]', address.street);
    await this.page.fill('[name="city"]', address.city);
    await this.page.fill('[name="state"]', address.state);
    await this.page.fill('[name="zipCode"]', address.zipCode);
    await this.page.fill('[name="country"]', address.country);
  }

  async completeOrder() {
    await this.page.click('[data-testid="place-order-button"]');
    await this.page.waitForURL('/order-confirmation/*');
  }
}