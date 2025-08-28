import { test, expect } from '@playwright/test';
import { TestHelpers } from './fixtures/test-helpers';
import { testUser } from './fixtures/test-data';

test.describe('User Authentication Flow', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should register a new user successfully', async ({ page }) => {
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('[name="firstName"]', testUser.firstName);
    await page.fill('[name="lastName"]', testUser.lastName);
    await page.fill('[name="email"]', `${Date.now()}@example.com`); // Unique email
    await page.fill('[name="password"]', testUser.password);
    await page.fill('[name="confirmPassword"]', testUser.password);
    
    // Submit form and wait for API response
    await page.click('[type="submit"]');
    await helpers.waitForAPIResponse('/api/auth/register', 201);
    
    // Verify successful registration (redirect or success message)
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('registered successfully');
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('[name="email"]', testUser.email);
    await page.fill('[name="password"]', testUser.password);
    
    // Submit form
    await page.click('[type="submit"]');
    await helpers.waitForAPIResponse('/api/auth/login');
    
    // Verify successful login
    await page.waitForURL(/\/dashboard|\/profile|\//, { timeout: 10000 });
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    
    // Check if authentication token is stored
    const localStorage = await page.evaluate(() => window.localStorage.getItem('authToken'));
    expect(localStorage).toBeTruthy();
  });

  test('should show error for invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill('[name="email"]', 'invalid@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    
    // Submit form
    await page.click('[type="submit"]');
    await helpers.waitForAPIResponse('/api/auth/login', 401);
    
    // Verify error message is displayed
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid credentials');
    
    // Verify user stays on login page
    expect(page.url()).toContain('/login');
  });

  test('should logout user successfully', async ({ page }) => {
    // First login
    await helpers.loginUser(testUser.email, testUser.password);
    
    // Verify user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    
    // Logout
    await page.click('[data-testid="logout-button"]');
    await helpers.waitForAPIResponse('/api/auth/logout');
    
    // Verify logout
    await page.waitForURL('/login');
    await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible();
    
    // Check if auth token is removed
    const localStorage = await page.evaluate(() => window.localStorage.getItem('authToken'));
    expect(localStorage).toBeFalsy();
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Try to access protected route without authentication
    await page.goto('/dashboard');
    
    // Should redirect to login
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
    
    // Login and verify access to protected route
    await helpers.loginUser(testUser.email, testUser.password);
    await page.goto('/dashboard');
    
    // Should now have access
    await expect(page.locator('[data-testid="dashboard-content"]')).toBeVisible();
  });

  test('should persist login session across page reloads', async ({ page }) => {
    // Login
    await helpers.loginUser(testUser.email, testUser.password);
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Verify user is still logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
    
    // Verify token refresh API call
    await helpers.waitForAPIResponse('/api/auth/verify');
  });

  test('should handle password reset flow', async ({ page }) => {
    await page.goto('/forgot-password');
    
    // Fill email for password reset
    await page.fill('[name="email"]', testUser.email);
    await page.click('[type="submit"]');
    
    // Wait for password reset API call
    await helpers.waitForAPIResponse('/api/auth/forgot-password');
    
    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-message"]')).toContainText('password reset email sent');
  });

  test('should validate form inputs', async ({ page }) => {
    await page.goto('/register');
    
    // Try to submit empty form
    await page.click('[type="submit"]');
    
    // Verify validation messages
    await expect(page.locator('[data-testid="firstName-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible();
    
    // Test email validation
    await page.fill('[name="email"]', 'invalid-email');
    await page.click('[type="submit"]');
    await expect(page.locator('[data-testid="email-error"]')).toContainText('valid email');
    
    // Test password confirmation
    await page.fill('[name="password"]', 'password123');
    await page.fill('[name="confirmPassword"]', 'password456');
    await page.click('[type="submit"]');
    await expect(page.locator('[data-testid="confirmPassword-error"]')).toContainText('passwords must match');
  });

  test('should handle authentication API errors gracefully', async ({ page }) => {
    // Test when backend is unavailable
    const isBackendRunning = await helpers.checkServerStatus('http://localhost:5000');
    
    if (isBackendRunning) {
      // Mock server error
      await page.route('**/api/auth/login', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Server error' })
        });
      });
    }
    
    await page.goto('/login');
    await page.fill('[name="email"]', testUser.email);
    await page.fill('[name="password"]', testUser.password);
    await page.click('[type="submit"]');
    
    // Verify error handling
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('server error');
    
    // Test retry
    await page.unroute('**/api/auth/login');
    await page.click('[type="submit"]');
    
    if (isBackendRunning) {
      await helpers.waitForAPIResponse('/api/auth/login');
    }
  });

  test('should handle token expiration', async ({ page }) => {
    // Login first
    await helpers.loginUser(testUser.email, testUser.password);
    
    // Mock expired token response
    await page.route('**/api/**', route => {
      if (route.request().headers().authorization) {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Token expired' })
        });
      } else {
        route.continue();
      }
    });
    
    // Try to access a protected API endpoint
    await page.goto('/dashboard');
    
    // Should redirect to login due to expired token
    await page.waitForURL('/login');
    expect(page.url()).toContain('/login');
  });
});