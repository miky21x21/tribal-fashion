// Setup test environment
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
  process.env.JWT_EXPIRE = '1h';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
});

// Clean up after all tests
afterAll(async () => {
  // Close any open connections
  try {
    const prisma = require('../src/config/database');
    await prisma.$disconnect();
  } catch (error) {
    // Ignore connection errors during cleanup
  }
});