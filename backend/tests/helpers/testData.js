// Test data factories for consistent testing

const mockProduct = {
  name: 'Test Product',
  description: 'This is a test product',
  price: 29.99,
  image: 'https://example.com/test-image.jpg',
  category: 'test-category',
  featured: false,
  inventory: 100
};

const mockUser = {
  email: 'testuser@example.com',
  password: 'testpassword123',
  firstName: 'Test',
  lastName: 'User'
};

const mockAdmin = {
  email: 'admin@example.com',
  password: 'adminpassword123',
  firstName: 'Admin',
  lastName: 'User',
  role: 'ADMIN'
};

const mockOrder = {
  items: [
    {
      productId: 'test-product-id',
      quantity: 2,
      price: 29.99
    }
  ],
  total: 59.98,
  status: 'PENDING'
};

// Generate variations of test data
const createProductVariations = () => [
  { ...mockProduct, name: 'Featured Product', featured: true },
  { ...mockProduct, name: 'Electronics Product', category: 'electronics', price: 199.99 },
  { ...mockProduct, name: 'Clothing Product', category: 'clothing', price: 49.99 },
  { ...mockProduct, name: 'Out of Stock Product', inventory: 0 }
];

const createUserVariations = () => [
  { ...mockUser, email: 'user1@example.com' },
  { ...mockUser, email: 'user2@example.com', firstName: 'Jane', lastName: 'Doe' },
  { ...mockAdmin, email: 'admin1@example.com' }
];

// Invalid data for error testing
const invalidProduct = {
  incomplete: { name: 'No Price' }, // Missing required fields
  invalidPrice: { ...mockProduct, price: 'not-a-number' },
  negativePrice: { ...mockProduct, price: -10 },
  emptyName: { ...mockProduct, name: '' },
  invalidInventory: { ...mockProduct, inventory: -5 }
};

const invalidUser = {
  noEmail: { password: 'test123', firstName: 'Test', lastName: 'User' },
  noPassword: { email: 'test@example.com', firstName: 'Test', lastName: 'User' },
  invalidEmail: { ...mockUser, email: 'not-an-email' },
  shortPassword: { ...mockUser, password: '123' },
  duplicateEmail: { ...mockUser } // For testing duplicate registration
};

const invalidAuth = {
  noEmail: { password: 'test123' },
  noPassword: { email: 'test@example.com' },
  wrongEmail: { email: 'wrong@example.com', password: 'test123' },
  wrongPassword: { email: 'test@example.com', password: 'wrongpassword' }
};

module.exports = {
  mockProduct,
  mockUser,
  mockAdmin,
  mockOrder,
  createProductVariations,
  createUserVariations,
  invalidProduct,
  invalidUser,
  invalidAuth
};