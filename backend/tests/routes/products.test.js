const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/database');
const { 
  createTestUser, 
  createTestAdmin, 
  generateToken, 
  getAuthHeaders,
  cleanupTestUsers 
} = require('../helpers/auth');
const { 
  mockProduct, 
  createProductVariations, 
  invalidProduct 
} = require('../helpers/testData');

describe('Products API', () => {
  let testUser, testAdmin, userToken, adminToken;

  beforeAll(async () => {
    // Create test users
    testUser = await createTestUser();
    testAdmin = await createTestAdmin();
    
    // Generate tokens
    userToken = generateToken(testUser.id);
    adminToken = generateToken(testAdmin.id);
  });

  afterAll(async () => {
    // Cleanup
    await prisma.product.deleteMany({
      where: { name: { contains: 'Test' } }
    });
    await cleanupTestUsers();
  });

  beforeEach(async () => {
    // Clean up products before each test
    await prisma.product.deleteMany({
      where: { name: { contains: 'Test' } }
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      // Create test products
      const products = createProductVariations();
      await prisma.product.createMany({ data: products });
    });

    test('should get all products successfully', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
    });

    test('should filter products by category', async () => {
      const response = await request(app)
        .get('/api/products?category=electronics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].category).toBe('electronics');
    });

    test('should filter featured products', async () => {
      const response = await request(app)
        .get('/api/products?featured=true')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.every(product => product.featured)).toBe(true);
    });

    test('should handle pagination correctly', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(2);
    });

    test('should return empty array when no products found with filter', async () => {
      const response = await request(app)
        .get('/api/products?category=nonexistent')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/products/featured', () => {
    beforeEach(async () => {
      const products = createProductVariations();
      await prisma.product.createMany({ data: products });
    });

    test('should get featured products successfully', async () => {
      const response = await request(app)
        .get('/api/products/featured')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.every(product => product.featured)).toBe(true);
    });

    test('should limit featured products to 10', async () => {
      // Create more than 10 featured products
      const featuredProducts = Array(15).fill(null).map((_, i) => ({
        ...mockProduct,
        name: `Featured Product ${i}`,
        featured: true
      }));
      await prisma.product.createMany({ data: featuredProducts });

      const response = await request(app)
        .get('/api/products/featured')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(10);
    });
  });

  describe('GET /api/products/:id', () => {
    let testProductId;

    beforeEach(async () => {
      const product = await prisma.product.create({ data: mockProduct });
      testProductId = product.id;
    });

    test('should get single product successfully', async () => {
      const response = await request(app)
        .get(`/api/products/${testProductId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(testProductId);
      expect(response.body.data.name).toBe(mockProduct.name);
      expect(response.body.data.price).toBe(mockProduct.price);
    });

    test('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Product not found');
    });

    test('should handle database errors gracefully', async () => {
      // Test with invalid ID format that might cause database error
      const response = await request(app)
        .get('/api/products/invalid-id-format-that-causes-error')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/products', () => {
    test('should create product successfully as admin', async () => {
      const response = await request(app)
        .post('/api/products')
        .set(getAuthHeaders(adminToken))
        .send(mockProduct)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.name).toBe(mockProduct.name);
      expect(response.body.data.price).toBe(mockProduct.price);
      expect(response.body.data.featured).toBe(mockProduct.featured);
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/products')
        .send(mockProduct)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });

    test('should fail with invalid token', async () => {
      const response = await request(app)
        .post('/api/products')
        .set(getAuthHeaders('invalid-token'))
        .send(mockProduct)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token is not valid');
    });

    test('should fail as regular user (insufficient permissions)', async () => {
      const response = await request(app)
        .post('/api/products')
        .set(getAuthHeaders(userToken))
        .send(mockProduct)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });

    test('should handle validation errors for incomplete data', async () => {
      const response = await request(app)
        .post('/api/products')
        .set(getAuthHeaders(adminToken))
        .send(invalidProduct.incomplete)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    test('should handle string values correctly', async () => {
      const productWithStrings = {
        ...mockProduct,
        price: '29.99',
        featured: 'true',
        inventory: '100'
      };

      const response = await request(app)
        .post('/api/products')
        .set(getAuthHeaders(adminToken))
        .send(productWithStrings)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.price).toBe(29.99);
      expect(response.body.data.featured).toBe(true);
      expect(response.body.data.inventory).toBe(100);
    });

    test('should reject malformed JSON', async () => {
      const response = await request(app)
        .post('/api/products')
        .set({ 
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        })
        .send('{ invalid json }')
        .expect(400);
    });

    test('should handle missing required fields', async () => {
      const incompleteProduct = { name: 'Incomplete Product' };
      
      const response = await request(app)
        .post('/api/products')
        .set(getAuthHeaders(adminToken))
        .send(incompleteProduct)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle database connection errors', async () => {
      // Mock database error
      const originalFindMany = prisma.product.findMany;
      prisma.product.findMany = jest.fn().mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app)
        .get('/api/products')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Database connection failed');

      // Restore original method
      prisma.product.findMany = originalFindMany;
    });

    test('should handle unexpected server errors', async () => {
      // Mock unexpected error
      const originalFindMany = prisma.product.findMany;
      prisma.product.findMany = jest.fn().mockRejectedValue(new Error('Unexpected error'));

      const response = await request(app)
        .get('/api/products')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();

      // Restore original method
      prisma.product.findMany = originalFindMany;
    });
  });

  describe('Response Format Consistency', () => {
    test('should maintain consistent response format for successful requests', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should maintain consistent error response format', async () => {
      const response = await request(app)
        .get('/api/products/non-existent')
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
    });
  });
});