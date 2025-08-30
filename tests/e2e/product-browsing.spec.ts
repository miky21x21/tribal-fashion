import { test, expect } from '@playwright/test';
import { TestHelpers } from './fixtures/test-helpers';

test.describe('Product Browsing and Catalog', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should display product catalog on shop page', async ({ page }) => {
    await page.goto('/shop');
    
    // Wait for products to load from API
    await helpers.waitForAPIResponse('/api/products');
    
    // Check if product grid is visible
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    
    // Verify at least one product is displayed
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
    
    // Check if product card contains essential elements
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct.locator('[data-testid="product-name"]')).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(firstProduct.locator('[data-testid="product-image"]')).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/shop');
    await helpers.waitForAPIResponse('/api/products');
    
    // Click on a category filter
    await page.click('[data-testid="category-filter"]:has-text("Electronics")');
    
    // Wait for filtered API call
    await helpers.waitForAPIResponse('/api/products');
    
    // Verify filtered results
    const products = page.locator('[data-testid="product-card"]');
    await expect(products.first()).toBeVisible();
    
    // Check if category filter is active
    await expect(page.locator('[data-testid="category-filter"].active')).toHaveText('Electronics');
  });

  test('should search for products', async ({ page }) => {
    await page.goto('/shop');
    await helpers.waitForAPIResponse('/api/products');
    
    // Search for a product
    await page.fill('[data-testid="search-input"]', 'laptop');
    await page.press('[data-testid="search-input"]', 'Enter');
    
    // Wait for search API response
    await helpers.waitForAPIResponse('/api/products');
    
    // Verify search results
    const products = page.locator('[data-testid="product-card"]');
    await expect(products.first()).toBeVisible();
    
    // Check if search term is highlighted or mentioned in results
    await expect(page.locator('[data-testid="search-results-info"]')).toContainText('laptop');
  });

  test('should display product details page', async ({ page }) => {
    await page.goto('/shop');
    await helpers.waitForAPIResponse('/api/products');
    
    // Click on first product
    await page.click('[data-testid="product-card"]').first();
    
    // Wait for product details API call
    await helpers.waitForAPIResponse('/api/products/');
    
    // Verify product details page elements
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-description"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-images"]')).toBeVisible();
    await expect(page.locator('[data-testid="add-to-cart-button"]')).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Test when backend is unavailable
    const isBackendRunning = await helpers.checkServerStatus('http://localhost:5000');
    
    if (isBackendRunning) {
      // If backend is running, we'll mock a failure response
      await page.route('**/api/products', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });
    }
    
    await page.goto('/shop');
    
    // Verify error handling UI
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    
    // Test retry functionality
    await page.unroute('**/api/products');
    await page.click('[data-testid="retry-button"]');
    
    if (isBackendRunning) {
      await helpers.waitForAPIResponse('/api/products');
      await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    }
  });

  test('should load more products on infinite scroll', async ({ page }) => {
    await page.goto('/shop');
    await helpers.waitForAPIResponse('/api/products');
    
    // Get initial product count
    const initialCount = await page.locator('[data-testid="product-card"]').count();
    
    // Scroll to bottom to trigger load more
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // Wait for additional products API call
    await helpers.waitForAPIResponse('/api/products');
    
    // Verify more products are loaded
    const newCount = await page.locator('[data-testid="product-card"]').count();
    expect(newCount).toBeGreaterThan(initialCount);
  });

  test('should sort products by price', async ({ page }) => {
    await page.goto('/shop');
    await helpers.waitForAPIResponse('/api/products');
    
    // Select price sorting
    await page.selectOption('[data-testid="sort-select"]', 'price-asc');
    await helpers.waitForAPIResponse('/api/products');
    
    // Get first two product prices
    const prices = await page.locator('[data-testid="product-price"]').allTextContents();
    
    // Verify ascending order (assuming prices are in format "$XX.XX")
    const price1 = parseFloat(prices[0].replace('$', ''));
    const price2 = parseFloat(prices[1].replace('$', ''));
    expect(price1).toBeLessThanOrEqual(price2);
  });
});