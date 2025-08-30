#!/usr/bin/env node

const TestRunner = require('../../lib/test-runner');
const ApiIntegrationTests = require('./api.test');
const DatabaseIntegrationTests = require('./database.test');

async function main() {
  const runner = new TestRunner();

  try {
    // Setup test environment
    await runner.setup();

    // Initialize test classes
    const apiTests = new ApiIntegrationTests();
    const dbTests = new DatabaseIntegrationTests();

    // Setup API tests
    await apiTests.setup();

    // Run database integration tests
    await runner.runTestSuite('Database Integration Tests', dbTests.getTests());

    // Run API integration tests
    await runner.runTestSuite('API Integration Tests', apiTests.getTests());

    // Generate test report
    const report = await runner.generateReport();

    // Exit with appropriate code
    const exitCode = report.summary.failed > 0 ? 1 : 0;
    process.exit(exitCode);

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Cleanup
    await runner.teardown();
  }
}

// Handle process signals for cleanup
process.on('SIGINT', async () => {
  console.log('\n🛑 Test execution interrupted');
  process.exit(130);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Test execution terminated');
  process.exit(143);
});

// Run tests
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { main };