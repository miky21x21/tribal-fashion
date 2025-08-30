const { PrismaClient } = require('@prisma/client');
const TestSeeder = require('./test-seeder');
const SchemaValidator = require('./schema-validator');

class DatabaseReset {
  constructor() {
    this.prisma = new PrismaClient();
    this.seeder = new TestSeeder();
    this.validator = new SchemaValidator();
  }

  async resetDatabase(options = {}) {
    const {
      validateSchema = true,
      seedData = true,
      skipValidation = false
    } = options;

    try {
      console.log('Starting database reset process...');

      // Step 1: Validate schema if requested
      if (validateSchema && !skipValidation) {
        console.log('Validating database schema...');
        const validationResult = await this.validator.validateSchema();
        
        if (!validationResult.isValid) {
          console.error('Schema validation failed:', validationResult.errors);
          throw new Error(`Schema validation failed: ${validationResult.errors.join(', ')}`);
        }
        
        console.log('Schema validation passed!');
        console.log('Tables validated:', Object.keys(validationResult.tables));
      }

      // Step 2: Clear existing data
      await this.clearAllData();

      // Step 3: Seed fresh test data if requested
      if (seedData) {
        console.log('Seeding fresh test data...');
        const seedResult = await this.seeder.seedTestData();
        console.log('Seeding completed:', seedResult);
      }

      console.log('Database reset completed successfully!');
      
      return {
        success: true,
        message: 'Database reset completed successfully',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Database reset failed:', error);
      throw error;
    }
  }

  async clearAllData() {
    console.log('Clearing all existing data...');
    
    try {
      // Clear data in the correct order to respect foreign key constraints
      await this.prisma.orderItem.deleteMany({});
      console.log('Cleared OrderItems');
      
      await this.prisma.order.deleteMany({});
      console.log('Cleared Orders');
      
      await this.prisma.product.deleteMany({});
      console.log('Cleared Products');
      
      await this.prisma.user.deleteMany({});
      console.log('Cleared Users');
      
      await this.prisma.heroContent.deleteMany({});
      console.log('Cleared HeroContent');
      
      console.log('All data cleared successfully!');
      
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  async resetForTesting() {
    // Special method for integration tests
    return await this.resetDatabase({
      validateSchema: true,
      seedData: true,
      skipValidation: false
    });
  }

  async quickReset() {
    // Quick reset without validation for development
    return await this.resetDatabase({
      validateSchema: false,
      seedData: true,
      skipValidation: true
    });
  }

  async validateOnly() {
    // Only validate schema without clearing/seeding
    console.log('Validating database schema only...');
    const validationResult = await this.validator.validateSchema();
    
    if (validationResult.isValid) {
      console.log('Schema validation passed!');
      console.log('Validated tables:', Object.keys(validationResult.tables));
    } else {
      console.error('Schema validation failed:', validationResult.errors);
    }
    
    return validationResult;
  }

  async getTableCounts() {
    // Utility method to check current data counts
    try {
      const counts = {
        users: await this.prisma.user.count(),
        products: await this.prisma.product.count(),
        orders: await this.prisma.order.count(),
        orderItems: await this.prisma.orderItem.count(),
        heroContent: await this.prisma.heroContent.count()
      };
      
      console.log('Current table counts:', counts);
      return counts;
      
    } catch (error) {
      console.error('Error getting table counts:', error);
      throw error;
    }
  }

  async disconnect() {
    await this.prisma.$disconnect();
    await this.seeder.disconnect();
    await this.validator.disconnect();
  }
}

module.exports = DatabaseReset;