# Tribal Fashion Backend

Backend API for the Tribal Fashion e-commerce platform built with Node.js, Express, and Prisma.

## Database Schema & Testing Utilities

This backend includes comprehensive database schema validation, test data seeding, and database reset utilities to ensure reliable testing and development.

### Available Scripts

#### Database Management
```bash
# Full database reset with schema validation and test data seeding
npm run db:reset

# Quick database reset without validation (development)
npm run db:reset-quick

# Validate database schema only
npm run db:validate

# Show current table row counts
npm run db:counts

# Setup database for testing (same as db:reset)
npm run test:setup
```

#### Testing
```bash
# Run integration tests (includes database reset)
npm run test:integration
```

#### Development
```bash
# Start development server
npm run dev

# Generate Prisma client
npm run build

# Run Prisma migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio
```

## Database Schema

The database includes the following main tables:

### Users
- `id` (String, CUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `firstName` (String)
- `lastName` (String)
- `avatar` (String, Optional)
- `role` (Enum: CUSTOMER, ADMIN)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Products
- `id` (String, CUID, Primary Key)
- `name` (String)
- `description` (String)
- `price` (Float)
- `image` (String)
- `category` (String)
- `featured` (Boolean)
- `inventory` (Integer)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Orders
- `id` (String, CUID, Primary Key)
- `userId` (String, Foreign Key)
- `total` (Float)
- `status` (Enum: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### OrderItems
- `id` (String, CUID, Primary Key)
- `orderId` (String, Foreign Key)
- `productId` (String, Foreign Key)
- `quantity` (Integer)
- `price` (Float)

## Schema Validation Utility

The `SchemaValidator` class provides comprehensive database schema validation:

- Validates table structure and field existence
- Checks data types and constraints
- Verifies enum values
- Tests foreign key relationships
- Provides detailed error reporting

## Test Data Seeding

The `TestSeeder` class creates consistent test data:

### Test Users
- Admin users with management privileges
- Customer users with various profiles
- Properly hashed passwords for security testing

### Test Products
- Multiple product categories (Sarees, Jewelry, Shawls, Kurtas, Bags, Crafts, etc.)
- Various price ranges and inventory levels
- Featured and non-featured products
- Realistic Jharkhand tribal fashion items

### Test Orders
- Orders with different statuses
- Multiple items per order
- Realistic order totals and quantities
- Proper user-order relationships

## Database Reset Mechanism

The `DatabaseReset` class provides flexible database management:

### Features
- Complete data clearing with proper foreign key handling
- Schema validation before operations
- Configurable seeding options
- Integration test support
- Development-friendly quick reset

### Usage Examples

```javascript
const DatabaseReset = require('./src/utils/database-reset');

const dbReset = new DatabaseReset();

// Full reset for testing
await dbReset.resetForTesting();

// Quick reset for development
await dbReset.quickReset();

// Validate schema only
const validation = await dbReset.validateOnly();

// Get current data counts
const counts = await dbReset.getTableCounts();
```

## Integration Testing

The integration test suite (`test-integration.js`) provides:

1. **Database Reset**: Ensures clean state before tests
2. **Schema Validation**: Verifies database structure
3. **CRUD Testing**: Tests basic operations on all tables
4. **Relationship Testing**: Validates foreign key relationships
5. **Data Integrity**: Ensures seeded data is correct

### Running Integration Tests

```bash
npm run test:integration
```

The test will:
- Reset the database with fresh test data
- Validate the schema structure
- Test CRUD operations
- Verify relationships between tables
- Clean up test artifacts
- Report success/failure with detailed logs

## Environment Setup

Ensure you have the following environment variables configured:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/tribal_fashion_db"
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your database and environment variables

3. Run Prisma migrations:
   ```bash
   npm run prisma:migrate
   ```

4. Reset database with test data:
   ```bash
   npm run db:reset
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Run integration tests to verify everything works:
   ```bash
   npm run test:integration
   ```