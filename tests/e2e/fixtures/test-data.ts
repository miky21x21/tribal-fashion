export const testUser = {
  email: 'test@example.com',
  password: 'testPassword123',
  firstName: 'John',
  lastName: 'Doe'
};

export const testProduct = {
  name: 'Test Product',
  price: 99.99,
  description: 'A test product for e2e testing'
};

export const testOrder = {
  items: [
    {
      productId: 1,
      quantity: 2,
      price: 99.99
    }
  ],
  shippingAddress: {
    street: '123 Test Street',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    country: 'Test Country'
  }
};