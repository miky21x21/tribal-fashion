const TestDatabase = require('../../lib/test-database');

class DatabaseIntegrationTests {
  constructor() {
    this.database = new TestDatabase();
  }

  async testDatabaseConnection() {
    await this.database.connect();
    
    // Test basic query
    const result = await this.database.prisma.$queryRaw`SELECT 1 as test`;
    if (!result || result[0].test !== 1) {
      throw new Error('Database connection test failed');
    }

    return true;
  }

  async testUserCRUD() {
    await this.database.connect();

    // Create
    const userData = {
      email: 'crud-test@example.com',
      password: 'testpassword',
      firstName: 'CRUD',
      lastName: 'Test',
      role: 'CUSTOMER'
    };

    const createdUser = await this.database.prisma.user.create({
      data: userData
    });

    if (!createdUser.id || createdUser.email !== userData.email) {
      throw new Error('User creation failed');
    }

    // Read
    const fetchedUser = await this.database.prisma.user.findUnique({
      where: { id: createdUser.id }
    });

    if (!fetchedUser || fetchedUser.email !== userData.email) {
      throw new Error('User read failed');
    }

    // Update
    const updatedUser = await this.database.prisma.user.update({
      where: { id: createdUser.id },
      data: { firstName: 'Updated' }
    });

    if (updatedUser.firstName !== 'Updated') {
      throw new Error('User update failed');
    }

    // Delete
    await this.database.prisma.user.delete({
      where: { id: createdUser.id }
    });

    const deletedUser = await this.database.prisma.user.findUnique({
      where: { id: createdUser.id }
    });

    if (deletedUser) {
      throw new Error('User delete failed');
    }

    return true;
  }

  async testProductCRUD() {
    await this.database.connect();

    // Create
    const productData = {
      name: 'CRUD Test Product',
      description: 'Product for CRUD testing',
      price: 99.99,
      image: '/test-crud-image.jpg',
      category: 'Test Category',
      inventory: 10
    };

    const createdProduct = await this.database.prisma.product.create({
      data: productData
    });

    if (!createdProduct.id || createdProduct.name !== productData.name) {
      throw new Error('Product creation failed');
    }

    // Read
    const fetchedProduct = await this.database.prisma.product.findUnique({
      where: { id: createdProduct.id }
    });

    if (!fetchedProduct || fetchedProduct.name !== productData.name) {
      throw new Error('Product read failed');
    }

    // Update
    const updatedProduct = await this.database.prisma.product.update({
      where: { id: createdProduct.id },
      data: { price: 149.99 }
    });

    if (updatedProduct.price !== 149.99) {
      throw new Error('Product update failed');
    }

    // Delete
    await this.database.prisma.product.delete({
      where: { id: createdProduct.id }
    });

    const deletedProduct = await this.database.prisma.product.findUnique({
      where: { id: createdProduct.id }
    });

    if (deletedProduct) {
      throw new Error('Product delete failed');
    }

    return true;
  }

  async testOrderWithItemsRelationship() {
    await this.database.connect();

    // Create test user and product first
    const user = await this.database.prisma.user.create({
      data: {
        email: 'relationship-test@example.com',
        password: 'testpassword',
        firstName: 'Relationship',
        lastName: 'Test',
        role: 'CUSTOMER'
      }
    });

    const product = await this.database.prisma.product.create({
      data: {
        name: 'Relationship Test Product',
        description: 'Product for relationship testing',
        price: 79.99,
        image: '/test-relationship-image.jpg',
        category: 'Test Category',
        inventory: 5
      }
    });

    // Create order with items
    const order = await this.database.prisma.order.create({
      data: {
        userId: user.id,
        total: 159.98,
        status: 'PENDING',
        items: {
          create: [
            {
              productId: product.id,
              quantity: 2,
              price: 79.99
            }
          ]
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true
      }
    });

    // Validate relationships
    if (!order.user || order.user.id !== user.id) {
      throw new Error('Order-User relationship failed');
    }

    if (!order.items || order.items.length !== 1) {
      throw new Error('Order-Items relationship failed');
    }

    if (!order.items[0].product || order.items[0].product.id !== product.id) {
      throw new Error('OrderItem-Product relationship failed');
    }

    // Cleanup
    await this.database.prisma.orderItem.deleteMany({
      where: { orderId: order.id }
    });
    await this.database.prisma.order.delete({
      where: { id: order.id }
    });
    await this.database.prisma.product.delete({
      where: { id: product.id }
    });
    await this.database.prisma.user.delete({
      where: { id: user.id }
    });

    return true;
  }

  async testDatabaseConstraints() {
    await this.database.connect();

    // Test unique email constraint
    const userData = {
      email: 'constraint-test@example.com',
      password: 'testpassword',
      firstName: 'Constraint',
      lastName: 'Test',
      role: 'CUSTOMER'
    };

    const user1 = await this.database.prisma.user.create({
      data: userData
    });

    try {
      // This should fail due to unique email constraint
      await this.database.prisma.user.create({
        data: userData
      });
      throw new Error('Unique constraint test should have failed');
    } catch (error) {
      if (!error.message.includes('Unique constraint')) {
        // Expected error for unique constraint violation
      } else {
        throw error;
      }
    }

    // Test foreign key constraint
    try {
      // This should fail due to foreign key constraint
      await this.database.prisma.order.create({
        data: {
          userId: 99999, // Non-existent user ID
          total: 100.00,
          status: 'PENDING'
        }
      });
      throw new Error('Foreign key constraint test should have failed');
    } catch (error) {
      if (!error.message.includes('Foreign key constraint')) {
        // Expected error for foreign key violation
      } else {
        throw error;
      }
    }

    // Cleanup
    await this.database.prisma.user.delete({
      where: { id: user1.id }
    });

    return true;
  }

  async testDatabaseSeeding() {
    const seedResult = await this.database.seed();
    
    if (!seedResult || !seedResult.users || !seedResult.products) {
      throw new Error('Database seeding failed');
    }

    const counts = await this.database.getTableCounts();
    
    if (counts.users === 0 || counts.products === 0) {
      throw new Error('Seeded data not found');
    }

    return seedResult;
  }

  async testTransactions() {
    await this.database.connect();

    try {
      await this.database.prisma.$transaction(async (tx) => {
        // Create user
        const user = await tx.user.create({
          data: {
            email: 'transaction-test@example.com',
            password: 'testpassword',
            firstName: 'Transaction',
            lastName: 'Test',
            role: 'CUSTOMER'
          }
        });

        // Create product
        const product = await tx.product.create({
          data: {
            name: 'Transaction Test Product',
            description: 'Product for transaction testing',
            price: 99.99,
            image: '/test-transaction-image.jpg',
            category: 'Test Category',
            inventory: 1
          }
        });

        // Create order
        await tx.order.create({
          data: {
            userId: user.id,
            total: 99.99,
            status: 'PENDING',
            items: {
              create: [
                {
                  productId: product.id,
                  quantity: 1,
                  price: 99.99
                }
              ]
            }
          }
        });

        // Intentionally throw error to test rollback
        throw new Error('Intentional rollback');
      });
    } catch (error) {
      if (error.message !== 'Intentional rollback') {
        throw error;
      }
    }

    // Verify transaction was rolled back
    const user = await this.database.prisma.user.findUnique({
      where: { email: 'transaction-test@example.com' }
    });

    if (user) {
      throw new Error('Transaction rollback failed - user still exists');
    }

    return true;
  }

  getTests() {
    return [
      {
        name: 'Database Connection',
        function: () => this.testDatabaseConnection()
      },
      {
        name: 'User CRUD Operations',
        function: () => this.testUserCRUD()
      },
      {
        name: 'Product CRUD Operations',
        function: () => this.testProductCRUD()
      },
      {
        name: 'Order-Items Relationships',
        function: () => this.testOrderWithItemsRelationship()
      },
      {
        name: 'Database Constraints',
        function: () => this.testDatabaseConstraints()
      },
      {
        name: 'Database Seeding',
        function: () => this.testDatabaseSeeding()
      },
      {
        name: 'Database Transactions',
        function: () => this.testTransactions()
      }
    ];
  }
}

module.exports = DatabaseIntegrationTests;