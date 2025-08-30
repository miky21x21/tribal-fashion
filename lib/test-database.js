const { PrismaClient } = require('@prisma/client');
const TestConfig = require('./test-config');

class TestDatabase {
  constructor() {
    this.config = new TestConfig();
    this.prisma = null;
    this.isConnected = false;
  }

  async connect() {
    if (this.isConnected) {
      return this.prisma;
    }

    try {
      this.prisma = new PrismaClient({
        datasources: {
          db: {
            url: this.config.getDatabaseUrl()
          }
        },
        log: this.config.isVerbose() ? ['query', 'info', 'warn', 'error'] : ['error']
      });

      // Test connection
      await this.prisma.$connect();
      this.isConnected = true;

      if (this.config.isVerbose()) {
        console.log('✅ Test database connected');
      }

      return this.prisma;
    } catch (error) {
      throw new Error(`Failed to connect to test database: ${error.message}`);
    }
  }

  async disconnect() {
    if (this.prisma && this.isConnected) {
      await this.prisma.$disconnect();
      this.isConnected = false;
      
      if (this.config.isVerbose()) {
        console.log('✅ Test database disconnected');
      }
    }
  }

  async seed() {
    if (!this.config.shouldSeedData()) {
      return;
    }

    try {
      await this.connect();

      if (this.config.isVerbose()) {
        console.log('🌱 Seeding test database...');
      }

      // Clear existing data
      await this.clearData();

      // Seed test users
      const users = await this.seedUsers();
      
      // Seed test products
      const products = await this.seedProducts();
      
      // Seed test orders
      await this.seedOrders(users, products);

      if (this.config.isVerbose()) {
        console.log('✅ Test database seeding completed');
      }

      return {
        users: users.length,
        products: products.length
      };
    } catch (error) {
      throw new Error(`Failed to seed test database: ${error.message}`);
    }
  }

  async clearData() {
    if (this.config.isVerbose()) {
      console.log('🧹 Clearing existing test data...');
    }

    // Delete in reverse order due to foreign key constraints
    await this.prisma.orderItem.deleteMany();
    await this.prisma.order.deleteMany();
    await this.prisma.product.deleteMany();
    await this.prisma.user.deleteMany();
  }

  async seedUsers() {
    const users = [
      {
        email: 'test.user1@example.com',
        password: 'hashedpassword1',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER'
      },
      {
        email: 'test.user2@example.com',
        password: 'hashedpassword2',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'CUSTOMER'
      },
      {
        email: 'test.admin@example.com',
        password: 'hashedpassword3',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await this.prisma.user.create({ data: userData });
      createdUsers.push(user);
    }

    return createdUsers;
  }

  async seedProducts() {
    const products = [
      {
        name: 'Test Tribal Shirt',
        description: 'Beautiful traditional tribal shirt for testing',
        price: 59.99,
        image: '/test-images/shirt1.jpg',
        category: 'Shirts',
        inventory: 10
      },
      {
        name: 'Test Tribal Dress',
        description: 'Elegant tribal dress for testing',
        price: 89.99,
        image: '/test-images/dress1.jpg',
        category: 'Dresses',
        inventory: 5
      },
      {
        name: 'Test Tribal Accessory',
        description: 'Authentic tribal accessory for testing',
        price: 29.99,
        image: '/test-images/accessory1.jpg',
        category: 'Accessories',
        inventory: 20
      }
    ];

    const createdProducts = [];
    for (const productData of products) {
      const product = await this.prisma.product.create({ data: productData });
      createdProducts.push(product);
    }

    return createdProducts;
  }

  async seedOrders(users, products) {
    const orders = [
      {
        userId: users[0].id,
        total: 89.98,
        status: 'PENDING',
        items: [
          {
            productId: products[0].id,
            quantity: 1,
            price: 59.99
          },
          {
            productId: products[2].id,
            quantity: 1,
            price: 29.99
          }
        ]
      },
      {
        userId: users[1].id,
        total: 89.99,
        status: 'COMPLETED',
        items: [
          {
            productId: products[1].id,
            quantity: 1,
            price: 89.99
          }
        ]
      }
    ];

    for (const orderData of orders) {
      await this.prisma.order.create({
        data: {
          userId: orderData.userId,
          total: orderData.total,
          status: orderData.status,
          items: {
            create: orderData.items
          }
        }
      });
    }
  }

  async cleanup() {
    if (!this.config.shouldCleanupAfterTests()) {
      return;
    }

    try {
      if (this.config.isVerbose()) {
        console.log('🧹 Cleaning up test data...');
      }

      await this.clearData();

      if (this.config.isVerbose()) {
        console.log('✅ Test cleanup completed');
      }
    } catch (error) {
      console.warn(`Warning: Test cleanup failed: ${error.message}`);
    }
  }

  async getTableCounts() {
    await this.connect();

    const [users, products, orders, orderItems] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.orderItem.count()
    ]);

    return {
      users,
      products,
      orders,
      orderItems
    };
  }

  async resetForTesting() {
    await this.connect();
    await this.clearData();
    await this.seed();
  }
}

module.exports = TestDatabase;