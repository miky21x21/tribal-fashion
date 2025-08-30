# Integration Testing Guide

This document explains how to set up, run, and troubleshoot integration tests for the Tribal Fashion application.

## Overview

The integration testing system provides comprehensive testing capabilities across different environments (development, staging, CI) with automatic database seeding, cleanup, and detailed reporting.

## Architecture

```
tests/
├── integration/
│   ├── run-tests.js      # Main test runner
│   ├── api.test.js       # API integration tests
│   └── database.test.js  # Database integration tests
├── e2e/                  # Playwright E2E tests
lib/
├── test-config.js        # Configuration management
├── test-database.js      # Database operations
└── test-runner.js        # Test execution framework
config/
├── test.dev.json         # Development config
├── test.staging.json     # Staging config
└── test.ci.json          # CI config
```

## Configuration

### Environment-Specific Configuration Files

The testing system uses JSON configuration files for different environments:

#### Development (`config/test.dev.json`)
```json
{
  "database": {
    "url": "postgresql://user:password@localhost:5432/tribal_fashion_test_dev",
    "maxConnections": 5,
    "timeout": 30000
  },
  "api": {
    "baseUrl": "http://localhost:3001",
    "timeout": 10000,
    "retries": 3
  },
  "test": {
    "timeout": 30000,
    "seedData": true,
    "cleanupAfterTests": true,
    "parallelTests": false,
    "verbose": true
  }
}
```

#### Staging (`config/test.staging.json`)
- Higher timeouts and connection limits
- Parallel test execution enabled
- Less verbose logging

#### CI (`config/test.ci.json`)
- Environment variable interpolation
- Multiple test reporters
- Optimized for CI/CD pipelines

### Environment Variables

For CI/CD environments, use these environment variables:

```bash
NODE_ENV=test
TEST_ENV=ci
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test_db
API_BASE_URL=http://localhost:3001
JWT_SECRET=your-test-jwt-secret
```

## Setup

### Prerequisites

1. **Database**: PostgreSQL instance running
2. **Backend Server**: Node.js/Express API server
3. **Dependencies**: All npm packages installed

### Quick Setup

```bash
# Install dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Setup test database (if using separate test DB)
cd backend
npx prisma generate
npx prisma migrate dev
npm run test:setup
```

### Database Configuration

1. Create a separate test database:
```sql
CREATE DATABASE tribal_fashion_test_dev;
```

2. Update your configuration files with the correct database URLs

3. Run database migrations:
```bash
cd backend
npx prisma migrate deploy
```

## Running Tests

### Basic Commands

```bash
# Run all integration tests (default: development environment)
npm run test:integration

# Run tests in specific environment
npm run test:integration:dev      # Development
npm run test:integration:staging  # Staging
npm run test:integration:ci       # CI

# Run with verbose output
npm run test:integration:verbose

# Run only database tests
npm run test:db

# Run only API tests
npm run test:api
```

### Manual Test Execution

```bash
# Run specific test file
node tests/integration/run-tests.js

# With environment variable
TEST_ENV=dev node tests/integration/run-tests.js

# With custom timeout
TIMEOUT=60000 node tests/integration/run-tests.js
```

## Test Types

### Database Integration Tests

Tests database operations, relationships, and constraints:

- **Connection Test**: Verifies database connectivity
- **CRUD Operations**: Tests Create, Read, Update, Delete for all entities
- **Relationships**: Validates foreign key relationships
- **Constraints**: Tests unique constraints and validations
- **Transactions**: Tests transaction rollback behavior
- **Seeding**: Validates database seeding functionality

### API Integration Tests

Tests API endpoints and business logic:

- **Health Check**: Verifies API server is running
- **Authentication**: Tests login/register endpoints
- **Product Operations**: CRUD operations via API
- **Order Management**: Creating and retrieving orders
- **Authorization**: Tests protected endpoints
- **Error Handling**: Invalid requests and error responses

## Database Seeding and Cleanup

### Automatic Seeding

The test system automatically seeds the database before tests:

```javascript
// Seed data includes:
- 3 test users (2 customers, 1 admin)
- 3 test products
- 2 sample orders with order items
```

### Manual Seeding

```bash
cd backend
npm run test:setup  # Reset and seed test database
```

### Cleanup

Tests automatically clean up after execution when `cleanupAfterTests: true` is set in configuration.

## CI/CD Integration

### GitHub Actions

The `.github/workflows/integration-tests.yml` file provides:

- PostgreSQL service container
- Node.js environment setup
- Database migration and seeding
- Backend server startup
- Test execution with proper environment variables
- Test result artifacts
- Automated PR comments with test results

### Running in CI

```yaml
env:
  NODE_ENV: test
  TEST_ENV: ci
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_BASE_URL: http://localhost:3001
  JWT_SECRET: ${{ secrets.JWT_SECRET }}

steps:
  - name: Run integration tests
    run: npm run test:integration:ci
```

## Test Reports

### Console Output

```
🧪 Running test suite: Database Integration Tests
==================================================
🧪 Running test: Database Connection
✅ Database Connection - PASSED
🧪 Running test: User CRUD Operations
✅ User CRUD Operations - PASSED
==================================================
✅ Test suite Database Integration Tests completed

📊 Test Results Summary
==============================
Total: 15
Passed: 14
Failed: 1
Skipped: 0
Duration: 5432ms
Environment: dev
```

### Report Files

- `test-results/test-results.json`: JSON format for programmatic access
- `test-results/junit.xml`: JUnit XML for CI integration
- `logs/test-*.log`: Detailed execution logs

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error**: `Failed to connect to test database`

**Solutions**:
- Verify PostgreSQL is running
- Check database URL in configuration
- Ensure test database exists
- Verify connection credentials

```bash
# Test database connection manually
psql postgresql://user:password@localhost:5432/tribal_fashion_test_dev
```

#### 2. API Server Not Running

**Error**: `API server is not running. Please start the backend server.`

**Solutions**:
- Start the backend server before running tests
- Verify the API base URL in configuration
- Check if the server is listening on the correct port

```bash
# Start backend server
cd backend
npm run dev

# Test API connectivity
curl http://localhost:3001/health
```

#### 3. Test Timeout

**Error**: `Test timeout after 30000ms`

**Solutions**:
- Increase timeout in configuration
- Check for slow database queries
- Verify network connectivity

```json
{
  "test": {
    "timeout": 60000
  }
}
```

#### 4. Prisma Migration Issues

**Error**: `Migration failed`

**Solutions**:
- Reset the test database
- Run migrations manually
- Check Prisma schema

```bash
cd backend
npx prisma migrate reset
npx prisma migrate dev
```

#### 5. Seeding Failures

**Error**: `Failed to seed test database`

**Solutions**:
- Check foreign key constraints
- Verify data format
- Clear existing data first

```bash
cd backend
npm run db:reset
npm run test:setup
```

### Debug Mode

Enable verbose logging for detailed debugging:

```bash
# Run with verbose output
npm run test:integration:verbose

# Set debug environment
DEBUG=* npm run test:integration
```

### Manual Database Inspection

```bash
# Connect to test database
psql postgresql://user:password@localhost:5432/tribal_fashion_test_dev

# Check table contents
\dt                    # List tables
SELECT * FROM users;   # Check users
SELECT * FROM products; # Check products
```

## Best Practices

### 1. Test Isolation

- Each test should be independent
- Use database transactions for cleanup
- Don't rely on test execution order

### 2. Configuration Management

- Keep sensitive data in environment variables
- Use different databases for different environments
- Document configuration requirements

### 3. Data Management

- Use minimal test data
- Clean up after tests
- Use factories for test data creation

### 4. Error Handling

- Provide clear error messages
- Test both success and failure scenarios
- Handle network timeouts gracefully

### 5. Performance

- Use database indexes for test queries
- Minimize external API calls
- Run tests in parallel where possible

## Extending Tests

### Adding New Test Cases

```javascript
// In tests/integration/api.test.js
async testNewFeature() {
  const response = await this.apiClient.get('/api/new-endpoint');
  
  if (response.status !== 200) {
    throw new Error(`Test failed with status: ${response.status}`);
  }

  return response.data;
}

// Add to getTests() method
getTests() {
  return [
    // ... existing tests
    {
      name: 'New Feature Test',
      function: () => this.testNewFeature()
    }
  ];
}
```

### Creating New Test Suites

```javascript
// tests/integration/new-feature.test.js
class NewFeatureTests {
  constructor() {
    this.config = new TestConfig();
  }

  async testSomething() {
    // Test implementation
  }

  getTests() {
    return [
      {
        name: 'Test Something',
        function: () => this.testSomething()
      }
    ];
  }
}

module.exports = NewFeatureTests;
```

Then add to `run-tests.js`:

```javascript
const NewFeatureTests = require('./new-feature.test');

// In main function
const newFeatureTests = new NewFeatureTests();
await runner.runTestSuite('New Feature Tests', newFeatureTests.getTests());
```

## Integration with Development Workflow

### Pre-commit Hooks

Add to `.husky/pre-commit`:

```bash
#!/bin/sh
npm run test:integration:dev
```

### Local Development

```bash
# Quick test during development
npm run test:integration:verbose

# Test specific areas
npm run test:db    # After database changes
npm run test:api   # After API changes
```

### Continuous Integration

The tests automatically run on:
- Push to main/develop branches
- Pull requests
- Manual workflow dispatch

Results are automatically posted as PR comments and uploaded as artifacts.