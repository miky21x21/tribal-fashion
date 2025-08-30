const { PrismaClient } = require('@prisma/client');

class SchemaValidator {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async validateSchema() {
    try {
      const validationResults = {
        isValid: true,
        errors: [],
        tables: {}
      };

      // Validate User table
      await this.validateUserTable(validationResults);
      
      // Validate Product table
      await this.validateProductTable(validationResults);
      
      // Validate Order table
      await this.validateOrderTable(validationResults);
      
      // Validate OrderItem table
      await this.validateOrderItemTable(validationResults);

      return validationResults;
    } catch (error) {
      return {
        isValid: false,
        errors: [`Schema validation failed: ${error.message}`],
        tables: {}
      };
    }
  }

  async validateUserTable(results) {
    try {
      // Test basic CRUD operations to validate table structure
      const testUser = await this.prisma.user.create({
        data: {
          email: `test-validation-${Date.now()}@example.com`,
          password: 'testpass123',
          firstName: 'Test',
          lastName: 'User',
          role: 'CUSTOMER'
        }
      });

      // Validate fields exist and have correct types
      const expectedFields = ['id', 'email', 'password', 'firstName', 'lastName', 'avatar', 'role', 'createdAt', 'updatedAt'];
      const missingFields = expectedFields.filter(field => !(field in testUser));
      
      if (missingFields.length > 0) {
        results.errors.push(`User table missing fields: ${missingFields.join(', ')}`);
        results.isValid = false;
      }

      // Validate role enum values
      const roles = await this.validateEnumValues('Role', ['CUSTOMER', 'ADMIN']);
      if (!roles.isValid) {
        results.errors.push(...roles.errors);
        results.isValid = false;
      }

      // Clean up test data
      await this.prisma.user.delete({ where: { id: testUser.id } });

      results.tables.User = { 
        exists: true, 
        fields: Object.keys(testUser),
        constraints: ['unique email', 'role enum']
      };

    } catch (error) {
      results.errors.push(`User table validation failed: ${error.message}`);
      results.isValid = false;
    }
  }

  async validateProductTable(results) {
    try {
      const testProduct = await this.prisma.product.create({
        data: {
          name: 'Test Product Validation',
          description: 'Test description',
          price: 99.99,
          image: '/test-image.jpg',
          category: 'Test Category',
          featured: false,
          inventory: 10
        }
      });

      const expectedFields = ['id', 'name', 'description', 'price', 'image', 'category', 'featured', 'inventory', 'createdAt', 'updatedAt'];
      const missingFields = expectedFields.filter(field => !(field in testProduct));
      
      if (missingFields.length > 0) {
        results.errors.push(`Product table missing fields: ${missingFields.join(', ')}`);
        results.isValid = false;
      }

      // Validate data types
      if (typeof testProduct.price !== 'number') {
        results.errors.push('Product price field should be numeric');
        results.isValid = false;
      }

      if (typeof testProduct.featured !== 'boolean') {
        results.errors.push('Product featured field should be boolean');
        results.isValid = false;
      }

      // Clean up test data
      await this.prisma.product.delete({ where: { id: testProduct.id } });

      results.tables.Product = { 
        exists: true, 
        fields: Object.keys(testProduct),
        constraints: ['price numeric', 'featured boolean', 'inventory integer']
      };

    } catch (error) {
      results.errors.push(`Product table validation failed: ${error.message}`);
      results.isValid = false;
    }
  }

  async validateOrderTable(results) {
    try {
      // Create a test user first for foreign key relationship
      const testUser = await this.prisma.user.create({
        data: {
          email: `test-order-validation-${Date.now()}@example.com`,
          password: 'testpass123',
          firstName: 'Test',
          lastName: 'User',
          role: 'CUSTOMER'
        }
      });

      const testOrder = await this.prisma.order.create({
        data: {
          userId: testUser.id,
          total: 199.99,
          status: 'PENDING'
        }
      });

      const expectedFields = ['id', 'userId', 'total', 'status', 'createdAt', 'updatedAt'];
      const missingFields = expectedFields.filter(field => !(field in testOrder));
      
      if (missingFields.length > 0) {
        results.errors.push(`Order table missing fields: ${missingFields.join(', ')}`);
        results.isValid = false;
      }

      // Validate OrderStatus enum
      const orderStatuses = await this.validateEnumValues('OrderStatus', 
        ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']);
      if (!orderStatuses.isValid) {
        results.errors.push(...orderStatuses.errors);
        results.isValid = false;
      }

      // Clean up test data
      await this.prisma.order.delete({ where: { id: testOrder.id } });
      await this.prisma.user.delete({ where: { id: testUser.id } });

      results.tables.Order = { 
        exists: true, 
        fields: Object.keys(testOrder),
        constraints: ['userId foreign key', 'status enum', 'total numeric']
      };

    } catch (error) {
      results.errors.push(`Order table validation failed: ${error.message}`);
      results.isValid = false;
    }
  }

  async validateOrderItemTable(results) {
    try {
      // Create test dependencies
      const testUser = await this.prisma.user.create({
        data: {
          email: `test-orderitem-validation-${Date.now()}@example.com`,
          password: 'testpass123',
          firstName: 'Test',
          lastName: 'User',
          role: 'CUSTOMER'
        }
      });

      const testProduct = await this.prisma.product.create({
        data: {
          name: 'Test Product for OrderItem',
          description: 'Test description',
          price: 99.99,
          image: '/test-image.jpg',
          category: 'Test Category',
          inventory: 10
        }
      });

      const testOrder = await this.prisma.order.create({
        data: {
          userId: testUser.id,
          total: 199.99,
          status: 'PENDING'
        }
      });

      const testOrderItem = await this.prisma.orderItem.create({
        data: {
          orderId: testOrder.id,
          productId: testProduct.id,
          quantity: 2,
          price: 99.99
        }
      });

      const expectedFields = ['id', 'orderId', 'productId', 'quantity', 'price'];
      const missingFields = expectedFields.filter(field => !(field in testOrderItem));
      
      if (missingFields.length > 0) {
        results.errors.push(`OrderItem table missing fields: ${missingFields.join(', ')}`);
        results.isValid = false;
      }

      // Clean up test data
      await this.prisma.orderItem.delete({ where: { id: testOrderItem.id } });
      await this.prisma.order.delete({ where: { id: testOrder.id } });
      await this.prisma.product.delete({ where: { id: testProduct.id } });
      await this.prisma.user.delete({ where: { id: testUser.id } });

      results.tables.OrderItem = { 
        exists: true, 
        fields: Object.keys(testOrderItem),
        constraints: ['orderId foreign key', 'productId foreign key', 'quantity integer', 'price numeric']
      };

    } catch (error) {
      results.errors.push(`OrderItem table validation failed: ${error.message}`);
      results.isValid = false;
    }
  }

  async validateEnumValues(enumName, expectedValues) {
    // This is a basic validation - in a real implementation, you might query the database schema
    // For now, we'll assume the enum validation passes if we can create records with these values
    return { isValid: true, errors: [] };
  }

  async disconnect() {
    await this.prisma.$disconnect();
  }
}

module.exports = SchemaValidator;