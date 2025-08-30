const DatabaseReset = require('./src/utils/database-reset');
const { PrismaClient } = require('@prisma/client');

async function runIntegrationTests() {
  const dbReset = new DatabaseReset();
  const prisma = new PrismaClient();
  
  try {
    console.log('🧪 Starting Integration Tests\n');

    // Step 1: Reset database with validation and fresh test data
    console.log('1. Resetting database for testing...');
    await dbReset.resetForTesting();
    console.log('✅ Database reset completed\n');

    // Step 2: Verify data was seeded correctly
    console.log('2. Verifying seeded data...');
    const counts = await dbReset.getTableCounts();
    
    // Basic assertions
    if (counts.users < 1) throw new Error('No users found after seeding');
    if (counts.products < 1) throw new Error('No products found after seeding');
    if (counts.orders < 1) throw new Error('No orders found after seeding');
    
    console.log('✅ Data verification passed\n');

    // Step 3: Test CRUD operations
    console.log('3. Testing CRUD operations...');
    
    // Test creating a new user
    const testUser = await prisma.user.create({
      data: {
        email: 'integration-test@example.com',
        password: 'hashedpassword',
        firstName: 'Integration',
        lastName: 'Test',
        role: 'CUSTOMER'
      }
    });
    console.log('✅ User creation test passed');

    // Test creating a new product
    const testProduct = await prisma.product.create({
      data: {
        name: 'Integration Test Product',
        description: 'Product for integration testing',
        price: 99.99,
        image: '/test-image.jpg',
        category: 'Test Category',
        inventory: 5
      }
    });
    console.log('✅ Product creation test passed');

    // Test creating an order with items
    const testOrder = await prisma.order.create({
      data: {
        userId: testUser.id,
        total: 199.98,
        status: 'PENDING',
        items: {
          create: [
            {
              productId: testProduct.id,
              quantity: 2,
              price: 99.99
            }
          ]
        }
      },
      include: {
        items: true
      }
    });
    console.log('✅ Order creation test passed');

    // Step 4: Test relationships
    console.log('4. Testing database relationships...');
    
    // Test user-order relationship
    const userWithOrders = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: { orders: true }
    });
    
    if (userWithOrders.orders.length === 0) {
      throw new Error('User-Order relationship not working');
    }
    console.log('✅ User-Order relationship test passed');

    // Test order-orderItem-product relationship
    const orderWithItems = await prisma.order.findUnique({
      where: { id: testOrder.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!orderWithItems.items[0].product) {
      throw new Error('Order-Product relationship not working');
    }
    console.log('✅ Order-Product relationship test passed');

    // Step 5: Clean up test data
    await prisma.orderItem.delete({ where: { id: orderWithItems.items[0].id } });
    await prisma.order.delete({ where: { id: testOrder.id } });
    await prisma.product.delete({ where: { id: testProduct.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    
    console.log('\n🎉 All integration tests passed!');
    
    return { success: true, message: 'Integration tests completed successfully' };

  } catch (error) {
    console.error('\n❌ Integration test failed:', error.message);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
    await dbReset.disconnect();
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runIntegrationTests()
    .then((result) => {
      if (!result.success) {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { runIntegrationTests };