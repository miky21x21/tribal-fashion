const axios = require('axios');
const TestConfig = require('../../lib/test-config');
const TestDatabase = require('../../lib/test-database');

class ApiIntegrationTests {
  constructor() {
    this.config = new TestConfig();
    this.database = new TestDatabase();
    this.apiClient = null;
    this.authToken = null;
  }

  async setup() {
    this.apiClient = axios.create({
      baseURL: this.config.getApiBaseUrl(),
      timeout: this.config.getApiTimeout(),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Setup request interceptor for auth
    this.apiClient.interceptors.request.use((config) => {
      if (this.authToken) {
        config.headers.Authorization = `Bearer ${this.authToken}`;
      }
      return config;
    });

    // Setup response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('API server is not running. Please start the backend server.');
        }
        throw error;
      }
    );
  }

  async authenticateTestUser() {
    try {
      const response = await this.apiClient.post('/auth/login', {
        email: 'test.user1@example.com',
        password: 'hashedpassword1'
      });

      this.authToken = response.data.token;
      return this.authToken;
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async testHealthCheck() {
    const response = await this.apiClient.get('/health');
    
    if (response.status !== 200) {
      throw new Error(`Health check failed with status: ${response.status}`);
    }

    return response.data;
  }

  async testGetProducts() {
    const response = await this.apiClient.get('/api/products');
    
    if (response.status !== 200) {
      throw new Error(`Get products failed with status: ${response.status}`);
    }

    const products = response.data;
    if (!Array.isArray(products)) {
      throw new Error('Products response is not an array');
    }

    if (products.length === 0) {
      throw new Error('No products returned');
    }

    // Validate product structure
    const product = products[0];
    const requiredFields = ['id', 'name', 'price', 'description'];
    for (const field of requiredFields) {
      if (!(field in product)) {
        throw new Error(`Product missing required field: ${field}`);
      }
    }

    return products;
  }

  async testGetSingleProduct() {
    // First get all products to get a valid ID
    const products = await this.testGetProducts();
    const productId = products[0].id;

    const response = await this.apiClient.get(`/api/products/${productId}`);
    
    if (response.status !== 200) {
      throw new Error(`Get single product failed with status: ${response.status}`);
    }

    const product = response.data;
    if (product.id !== productId) {
      throw new Error('Returned product ID does not match requested ID');
    }

    return product;
  }

  async testCreateUser() {
    const newUser = {
      email: 'api-test-user@example.com',
      password: 'testpassword123',
      firstName: 'API',
      lastName: 'Test'
    };

    const response = await this.apiClient.post('/auth/register', newUser);
    
    if (response.status !== 201) {
      throw new Error(`Create user failed with status: ${response.status}`);
    }

    const createdUser = response.data.user;
    if (createdUser.email !== newUser.email) {
      throw new Error('Created user email does not match');
    }

    // Cleanup
    await this.database.connect();
    await this.database.prisma.user.delete({
      where: { email: newUser.email }
    });

    return createdUser;
  }

  async testCreateOrder() {
    await this.authenticateTestUser();
    
    // Get a product to order
    const products = await this.testGetProducts();
    const product = products[0];

    const orderData = {
      items: [
        {
          productId: product.id,
          quantity: 2
        }
      ]
    };

    const response = await this.apiClient.post('/api/orders', orderData);
    
    if (response.status !== 201) {
      throw new Error(`Create order failed with status: ${response.status}`);
    }

    const order = response.data;
    if (!order.id || !order.total) {
      throw new Error('Order missing required fields');
    }

    // Cleanup
    await this.database.connect();
    await this.database.prisma.orderItem.deleteMany({
      where: { orderId: order.id }
    });
    await this.database.prisma.order.delete({
      where: { id: order.id }
    });

    return order;
  }

  async testGetUserOrders() {
    await this.authenticateTestUser();
    
    const response = await this.apiClient.get('/api/orders');
    
    if (response.status !== 200) {
      throw new Error(`Get user orders failed with status: ${response.status}`);
    }

    const orders = response.data;
    if (!Array.isArray(orders)) {
      throw new Error('Orders response is not an array');
    }

    return orders;
  }

  async testUnauthorizedAccess() {
    // Remove auth token
    this.authToken = null;

    try {
      await this.apiClient.get('/api/orders');
      throw new Error('Unauthorized request should have failed');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return true; // Expected behavior
      }
      throw error;
    }
  }

  async testInvalidEndpoint() {
    try {
      await this.apiClient.get('/api/nonexistent');
      throw new Error('Request to invalid endpoint should have failed');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return true; // Expected behavior
      }
      throw error;
    }
  }

  getTests() {
    return [
      {
        name: 'API Health Check',
        function: () => this.testHealthCheck()
      },
      {
        name: 'Get Products',
        function: () => this.testGetProducts()
      },
      {
        name: 'Get Single Product',
        function: () => this.testGetSingleProduct()
      },
      {
        name: 'Create User',
        function: () => this.testCreateUser()
      },
      {
        name: 'Create Order',
        function: () => this.testCreateOrder()
      },
      {
        name: 'Get User Orders',
        function: () => this.testGetUserOrders()
      },
      {
        name: 'Unauthorized Access',
        function: () => this.testUnauthorizedAccess()
      },
      {
        name: 'Invalid Endpoint',
        function: () => this.testInvalidEndpoint()
      }
    ];
  }
}

module.exports = ApiIntegrationTests;