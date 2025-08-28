const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { 
  createTestUser, 
  generateToken, 
  getAuthHeaders,
  cleanupTestUsers 
} = require('../helpers/auth');
const { 
  mockUser, 
  mockAdmin, 
  invalidUser, 
  invalidAuth 
} = require('../helpers/testData');

describe('Auth API', () => {
  let testUser, testToken;

  afterAll(async () => {
    await cleanupTestUsers();
  });

  beforeEach(async () => {
    await cleanupTestUsers();
  });

  describe('POST /api/auth/register', () => {
    test('should register new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(mockUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(mockUser.email);
      expect(response.body.data.user.firstName).toBe(mockUser.firstName);
      expect(response.body.data.user.lastName).toBe(mockUser.lastName);
      expect(response.body.data.user.password).toBeUndefined();
    });

    test('should validate JWT token format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(mockUser)
        .expect(201);

      const token = response.body.data.token;
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts separated by dots
      
      // Verify token can be decoded
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(response.body.data.user.id);
    });

    test('should hash password correctly', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(mockUser)
        .expect(201);

      const user = await prisma.user.findUnique({
        where: { email: mockUser.email }
      });

      expect(user).toBeDefined();
      expect(user.password).not.toBe(mockUser.password);
      expect(await bcrypt.compare(mockUser.password, user.password)).toBe(true);
    });

    test('should prevent duplicate email registration', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send(mockUser)
        .expect(201);

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(mockUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('User already exists');
    });

    test('should handle missing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser.noEmail)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    test('should handle missing password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser.noPassword)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    test('should handle invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser.invalidEmail)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    test('should handle missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' })
        .expect(500);

      expect(response.body.success).toBe(false);
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }')
        .expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      testUser = await createTestUser(mockUser);
    });

    test('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(mockUser.email);
      expect(response.body.data.user.password).toBeUndefined();
    });

    test('should validate JWT token on login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: mockUser.password
        })
        .expect(200);

      const token = response.body.data.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(testUser.id);
    });

    test('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidAuth.wrongEmail)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should handle missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidAuth.noEmail)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    test('should handle missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidAuth.noPassword)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    test('should handle non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    beforeEach(async () => {
      testUser = await createTestUser(mockUser);
      testToken = generateToken(testUser.id);
    });

    test('should get current user successfully', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeaders(testToken))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBe(testUser.id);
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.password).toBeUndefined();
    });

    test('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });

    test('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeaders('invalid-token'))
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token is not valid');
    });

    test('should reject expired token', async () => {
      const expiredToken = jwt.sign(
        { id: testUser.id },
        process.env.JWT_SECRET,
        { expiresIn: '-1h' } // Expired token
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeaders(expiredToken))
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token is not valid');
    });

    test('should reject token for non-existent user', async () => {
      // Create token for user that doesn't exist in database
      const fakeToken = jwt.sign(
        { id: 'non-existent-user-id' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeaders(fakeToken))
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token is not valid');
    });

    test('should handle malformed Authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });

    test('should handle empty Authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', '')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Access denied');
    });
  });

  describe('Security Tests', () => {
    test('should not expose sensitive user data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(mockUser)
        .expect(201);

      expect(response.body.data.user.password).toBeUndefined();
      expect(response.body.data.user.id).toBeDefined();
    });

    test('should generate different tokens for different users', async () => {
      const user1Response = await request(app)
        .post('/api/auth/register')
        .send(mockUser)
        .expect(201);

      const user2 = { ...mockUser, email: 'user2@example.com' };
      const user2Response = await request(app)
        .post('/api/auth/register')
        .send(user2)
        .expect(201);

      expect(user1Response.body.data.token).not.toBe(user2Response.body.data.token);
    });

    test('should validate token signature', async () => {
      const validToken = jwt.sign(
        { id: 'test-user-id' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      const invalidToken = jwt.sign(
        { id: 'test-user-id' },
        'wrong-secret',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set(getAuthHeaders(invalidToken))
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    test('should handle database errors during registration', async () => {
      const originalCreate = prisma.user.create;
      prisma.user.create = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/register')
        .send(mockUser)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Database error');

      prisma.user.create = originalCreate;
    });

    test('should handle database errors during login', async () => {
      const originalFindUnique = prisma.user.findUnique;
      prisma.user.findUnique = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Database error');

      prisma.user.findUnique = originalFindUnique;
    });
  });

  describe('Response Format Consistency', () => {
    test('should maintain consistent success response format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(mockUser)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
    });

    test('should maintain consistent error response format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidAuth.wrongEmail)
        .expect(401);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(typeof response.body.message).toBe('string');
    });
  });
});