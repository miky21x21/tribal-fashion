import { test, expect } from '@playwright/test';
import { TestHelpers } from './fixtures/test-helpers';
import { testUser, testOrder } from './fixtures/test-data';

test.describe('Complete Order Placement Process', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    // Login before each test
    await helpers.loginUser(testUser.email, testUser.password);
  });

  test('should add products to cart successfully', async ({ page }) => {
    await page.goto('/shop');
    await helpers.waitForAPIResponse('/api/products');
    
    // Click on first product
    await page.click('[data-testid="product-card"]').first();
    await helpers.waitForAPIResponse('/api/products/');
    
    // Add to cart
    await page.click('[data-testid="add-to-cart-button"]');
    await helpers.waitForAPIResponse('/api/cart', 201);
    
    // Verify cart count updated
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    
    // Verify success message
    await expect(page.locator('[data-testid="cart-success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-success-message"]')).toContainText('Added to cart');
  });

  test('should update cart quantities', async ({ page }) => {
    // Add product to cart first
    await helpers.addProductToCart('1');
    
    // Go to cart page
    await page.goto('/cart');
    await helpers.waitForAPIResponse('/api/cart');
    
    // Verify cart items are displayed
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
    
    // Update quantity
    await page.click('[data-testid="quantity-increase"]');
    await helpers.waitForAPIResponse('/api/cart');
    
    // Verify quantity updated
    await expect(page.locator('[data-testid="item-quantity"]')).toHaveValue('2');
    
    // Verify total price updated
    const totalPrice = page.locator('[data-testid="cart-total"]');
    await expect(totalPrice).toBeVisible();
    const total = await totalPrice.textContent();
    expect(parseFloat(total!.replace('$', ''))).toBeGreaterThan(0);
  });

  test('should remove items from cart', async ({ page }) => {
    // Add product to cart
    await helpers.addProductToCart('1');
    await page.goto('/cart');
    await helpers.waitForAPIResponse('/api/cart');
    
    // Remove item
    await page.click('[data-testid="remove-item-button"]');
    await helpers.waitForAPIResponse('/api/cart');
    
    // Verify item removed
    await expect(page.locator('[data-testid="cart-empty-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('0');
  });

  test('should proceed to checkout with items in cart', async ({ page }) => {
    // Add product to cart
    await helpers.addProductToCart('1');
    
    // Proceed to checkout
    await helpers.proceedToCheckout();
    
    // Verify checkout page loads
    await expect(page.locator('[data-testid="checkout-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
    
    // Verify order summary shows correct items
    await expect(page.locator('[data-testid="checkout-item"]')).toBeVisible();
    await expect(page.locator('[data-testid="checkout-total"]')).toBeVisible();
  });

  test('should complete full order placement flow', async ({ page }) => {
    // Add product to cart
    await helpers.addProductToCart('1');
    
    // Proceed to checkout
    await helpers.proceedToCheckout();
    
    // Fill shipping address
    await helpers.fillShippingAddress(testOrder.shippingAddress);
    
    // Select payment method
    await page.check('[data-testid="payment-method-credit"]');
    
    // Fill credit card details
    await page.fill('[name="cardNumber"]', '4111111111111111');
    await page.fill('[name="expiryMonth"]', '12');
    await page.fill('[name="expiryYear"]', '25');
    await page.fill('[name="cvv"]', '123');
    await page.fill('[name="cardName"]', `${testUser.firstName} ${testUser.lastName}`);
    
    // Review order
    await expect(page.locator('[data-testid="order-review"]')).toBeVisible();
    
    // Place order
    await page.click('[data-testid="place-order-button"]');
    await helpers.waitForAPIResponse('/api/orders', 201);
    
    // Verify order confirmation
    await page.waitForURL('/order-confirmation/*');
    await expect(page.locator('[data-testid="order-success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
    
    // Verify cart is cleared
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('0');
  });

  test('should validate checkout form fields', async ({ page }) => {
    await helpers.addProductToCart('1');
    await helpers.proceedToCheckout();
    
    // Try to submit without required fields
    await page.click('[data-testid="place-order-button"]');
    
    // Verify validation messages
    await expect(page.locator('[data-testid="street-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="city-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-error"]')).toBeVisible();
    
    // Test invalid card number
    await page.fill('[name="cardNumber"]', '1234');
    await page.click('[data-testid="place-order-button"]');
    await expect(page.locator('[data-testid="card-error"]')).toContainText('valid card number');
  });

  test('should calculate correct order totals', async ({ page }) => {
    // Add multiple products to cart
    await helpers.addProductToCart('1');
    await page.goto('/shop');
    await helpers.addProductToCart('2');
    
    await page.goto('/cart');
    await helpers.waitForAPIResponse('/api/cart');
    
    // Get individual item prices
    const itemPrices = await page.locator('[data-testid="item-price"]').allTextContents();
    const subtotal = itemPrices.reduce((sum, price) => 
      sum + parseFloat(price.replace('$', '')), 0
    );
    
    // Verify subtotal
    const displayedSubtotal = await page.locator('[data-testid="cart-subtotal"]').textContent();
    expect(parseFloat(displayedSubtotal!.replace('$', ''))).toBeCloseTo(subtotal, 2);
    
    // Proceed to checkout to verify final totals
    await helpers.proceedToCheckout();
    
    // Verify tax and shipping are calculated
    await expect(page.locator('[data-testid="tax-amount"]')).toBeVisible();
    await expect(page.locator('[data-testid="shipping-amount"]')).toBeVisible();
    await expect(page.locator('[data-testid="final-total"]')).toBeVisible();
  });

  test('should handle out of stock products', async ({ page }) => {
    // Mock out of stock response
    await page.route('**/api/products/*/availability', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ available: false, stock: 0 })
      });
    });
    
    await page.goto('/shop/product/1');
    await helpers.waitForAPIResponse('/api/products/');
    
    // Verify out of stock message
    await expect(page.locator('[data-testid="out-of-stock-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="add-to-cart-button"]')).toBeDisabled();
  });

  test('should handle payment processing errors', async ({ page }) => {
    await helpers.addProductToCart('1');
    await helpers.proceedToCheckout();
    await helpers.fillShippingAddress(testOrder.shippingAddress);
    
    // Fill valid card details
    await page.check('[data-testid="payment-method-credit"]');
    await page.fill('[name="cardNumber"]', '4111111111111111');
    await page.fill('[name="expiryMonth"]', '12');
    await page.fill('[name="expiryYear"]', '25');
    await page.fill('[name="cvv"]', '123');
    await page.fill('[name="cardName"]', `${testUser.firstName} ${testUser.lastName}`);
    
    // Mock payment failure
    await page.route('**/api/orders', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Payment declined' })
      });
    });
    
    await page.click('[data-testid="place-order-button"]');
    
    // Verify error handling
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="payment-error"]')).toContainText('Payment declined');
    
    // Verify user stays on checkout page
    expect(page.url()).toContain('/checkout');
  });

  test('should save order to order history', async ({ page }) => {
    // Complete an order
    await helpers.addProductToCart('1');
    await helpers.proceedToCheckout();
    await helpers.fillShippingAddress(testOrder.shippingAddress);
    
    await page.check('[data-testid="payment-method-credit"]');
    await page.fill('[name="cardNumber"]', '4111111111111111');
    await page.fill('[name="expiryMonth"]', '12');
    await page.fill('[name="expiryYear"]', '25');
    await page.fill('[name="cvv"]', '123');
    await page.fill('[name="cardName"]', `${testUser.firstName} ${testUser.lastName}`);
    
    await page.click('[data-testid="place-order-button"]');
    await helpers.waitForAPIResponse('/api/orders', 201);
    await page.waitForURL('/order-confirmation/*');
    
    // Get order number
    const orderNumber = await page.locator('[data-testid="order-number"]').textContent();
    
    // Navigate to order history
    await page.goto('/orders');
    await helpers.waitForAPIResponse('/api/orders');
    
    // Verify order appears in history
    await expect(page.locator(`[data-testid="order-${orderNumber}"]`)).toBeVisible();
    
    // Click to view order details
    await page.click(`[data-testid="order-${orderNumber}"]`);
    await helpers.waitForAPIResponse(`/api/orders/${orderNumber}`);
    
    // Verify order details are displayed
    await expect(page.locator('[data-testid="order-details"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-items"]')).toBeVisible();
    await expect(page.locator('[data-testid="shipping-address"]')).toBeVisible();
  });

  test('should handle backend unavailability during checkout', async ({ page }) => {
    await helpers.addProductToCart('1');
    await helpers.proceedToCheckout();
    
    // Check if backend is running
    const isBackendRunning = await helpers.checkServerStatus('http://localhost:5000');
    
    if (isBackendRunning) {
      // Mock server error
      await page.route('**/api/orders', route => {
        route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Service unavailable' })
        });
      });
    }
    
    await helpers.fillShippingAddress(testOrder.shippingAddress);
    await page.check('[data-testid="payment-method-credit"]');
    await page.fill('[name="cardNumber"]', '4111111111111111');
    await page.fill('[name="expiryMonth"]', '12');
    await page.fill('[name="expiryYear"]', '25');
    await page.fill('[name="cvv"]', '123');
    await page.fill('[name="cardName"]', `${testUser.firstName} ${testUser.lastName}`);
    
    await page.click('[data-testid="place-order-button"]');
    
    // Verify error handling
    await expect(page.locator('[data-testid="service-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="retry-order-button"]')).toBeVisible();
    
    // Test retry functionality
    await page.unroute('**/api/orders');
    await page.click('[data-testid="retry-order-button"]');
    
    if (isBackendRunning) {
      await helpers.waitForAPIResponse('/api/orders', 201);
      await page.waitForURL('/order-confirmation/*');
    }
  });
});