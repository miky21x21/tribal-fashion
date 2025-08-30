import { chromium, FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('Running global teardown...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Check if backend is available
    const response = await page.request.get('http://localhost:5000/health');
    
    if (response.ok()) {
      // Cleanup test data if needed
      try {
        // Example: Delete test orders, reset test user data, etc.
        console.log('Cleaning up test data...');
        
        // Delete test user's orders
        await page.request.delete('http://localhost:5000/api/test/cleanup', {
          data: { email: 'test@example.com' }
        });
        
        console.log('Test data cleanup completed');
      } catch (error) {
        console.log('Test cleanup failed (this is usually fine):', error);
      }
    }
    
  } catch (error) {
    console.log('Global teardown failed (this is usually fine):', error);
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalTeardown;