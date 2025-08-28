const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../../src/config/database');

// Generate JWT token for testing
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Create test user
const createTestUser = async (userData = {}) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password || 'testpassword', salt);
  
  const user = await prisma.user.create({
    data: {
      email: userData.email || 'test@example.com',
      password: hashedPassword,
      firstName: userData.firstName || 'Test',
      lastName: userData.lastName || 'User',
      role: userData.role || 'USER'
    }
  });
  
  return user;
};

// Create admin test user
const createTestAdmin = async (userData = {}) => {
  return createTestUser({
    ...userData,
    email: userData.email || 'admin@example.com',
    role: 'ADMIN'
  });
};

// Get auth headers with token
const getAuthHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Clean up test users
const cleanupTestUsers = async () => {
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: { contains: 'test' } },
        { email: { contains: 'example.com' } }
      ]
    }
  });
};

module.exports = {
  generateToken,
  createTestUser,
  createTestAdmin,
  getAuthHeaders,
  cleanupTestUsers
};