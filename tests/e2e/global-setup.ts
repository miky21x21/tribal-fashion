import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('Running global setup...');
  
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Wait for servers to be ready
    console.log('Checking frontend server...');
    await page.goto('http://localhost:3000', { timeout: 60000 });
    console.log('Frontend server is ready');
    
    console.log('Checking backend server...');
    const response = await page.request.get('http://localhost:5000/health');
    if (response.ok()) {
      console.log('Backend server is ready');
    } else {
      console.warn('Backend server not available - some tests may fail');
    }
    
    // Create test user if backend is available
    if (response.ok()) {
      try {
        await page.request.post('http://localhost:5000/api/auth/register', {
          data: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@example.com',
            password: 'testPassword123'
          }
        });
        console.log('Test user created');
      } catch (error) {
        console.log('Test user may already exist or registration failed:', error);
      }
    }
    
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

export default globalSetup;