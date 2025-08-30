const fs = require('fs').promises;
const path = require('path');
const TestConfig = require('./test-config');
const TestDatabase = require('./test-database');

class TestRunner {
  constructor() {
    this.config = new TestConfig();
    this.database = new TestDatabase();
    this.results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      errors: []
    };
    this.startTime = null;
  }

  async setup() {
    try {
      this.startTime = Date.now();
      
      if (this.config.isVerbose()) {
        console.log('🚀 Setting up test environment...');
        console.log(`Environment: ${this.config.testEnv}`);
        console.log(`Database: ${this.config.getDatabaseUrl()}`);
        console.log(`API Base URL: ${this.config.getApiBaseUrl()}`);
      }

      // Setup test database
      await this.database.resetForTesting();

      // Create logs directory if logging to file
      if (this.config.shouldLogToFile()) {
        const logDir = path.dirname(this.config.getLogFilePath());
        await fs.mkdir(logDir, { recursive: true });
      }

      if (this.config.isVerbose()) {
        console.log('✅ Test environment setup completed\n');
      }
    } catch (error) {
      throw new Error(`Test setup failed: ${error.message}`);
    }
  }

  async teardown() {
    try {
      if (this.config.isVerbose()) {
        console.log('\n🧹 Tearing down test environment...');
      }

      await this.database.cleanup();
      await this.database.disconnect();

      if (this.config.isVerbose()) {
        console.log('✅ Test environment teardown completed');
      }
    } catch (error) {
      console.warn(`Test teardown warning: ${error.message}`);
    }
  }

  async runTest(testName, testFunction, options = {}) {
    const timeout = options.timeout || this.config.getTestTimeout();
    
    try {
      if (this.config.isVerbose()) {
        console.log(`🧪 Running test: ${testName}`);
      }

      const result = await Promise.race([
        testFunction(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Test timeout after ${timeout}ms`)), timeout)
        )
      ]);

      this.results.passed++;
      
      if (this.config.isVerbose()) {
        console.log(`✅ ${testName} - PASSED`);
      }

      return { success: true, result };
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({ test: testName, error: error.message });
      
      if (this.config.isVerbose() || this.config.shouldLogToConsole()) {
        console.log(`❌ ${testName} - FAILED: ${error.message}`);
      }

      return { success: false, error: error.message };
    }
  }

  async runTestSuite(suiteName, tests) {
    if (this.config.isVerbose()) {
      console.log(`\n🎯 Running test suite: ${suiteName}`);
      console.log('='.repeat(50));
    }

    const suiteResults = [];

    for (const test of tests) {
      const result = await this.runTest(test.name, test.function, test.options);
      suiteResults.push({ ...test, result });
    }

    if (this.config.isVerbose()) {
      console.log('='.repeat(50));
      console.log(`✅ Test suite ${suiteName} completed\n`);
    }

    return suiteResults;
  }

  async generateReport() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;

    const report = {
      summary: {
        total: this.results.passed + this.results.failed + this.results.skipped,
        passed: this.results.passed,
        failed: this.results.failed,
        skipped: this.results.skipped,
        duration: duration,
        environment: this.config.testEnv
      },
      errors: this.results.errors,
      timestamp: new Date().toISOString()
    };

    // Console report
    console.log('\n📊 Test Results Summary');
    console.log('='.repeat(30));
    console.log(`Total: ${report.summary.total}`);
    console.log(`Passed: ${report.summary.passed}`);
    console.log(`Failed: ${report.summary.failed}`);
    console.log(`Skipped: ${report.summary.skipped}`);
    console.log(`Duration: ${duration}ms`);
    console.log(`Environment: ${report.summary.environment}`);

    if (report.errors.length > 0) {
      console.log('\n❌ Failed Tests:');
      report.errors.forEach(error => {
        console.log(`  - ${error.test}: ${error.error}`);
      });
    }

    // Generate reports for CI
    const reporters = this.config.getTestReporters();
    for (const reporter of reporters) {
      await this.generateReporterOutput(reporter, report);
    }

    return report;
  }

  async generateReporterOutput(reporter, report) {
    try {
      switch (reporter) {
        case 'json':
          await this.generateJsonReport(report);
          break;
        case 'junit':
          await this.generateJunitReport(report);
          break;
        case 'github-actions':
          this.generateGithubActionsReport(report);
          break;
        default:
          if (this.config.isVerbose()) {
            console.log(`Unknown reporter: ${reporter}`);
          }
      }
    } catch (error) {
      console.warn(`Failed to generate ${reporter} report: ${error.message}`);
    }
  }

  async generateJsonReport(report) {
    const reportPath = path.join('./test-results', 'test-results.json');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    if (this.config.isVerbose()) {
      console.log(`JSON report generated: ${reportPath}`);
    }
  }

  async generateJunitReport(report) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<testsuite name="Integration Tests" 
           tests="${report.summary.total}" 
           failures="${report.summary.failed}" 
           errors="0" 
           skipped="${report.summary.skipped}" 
           time="${report.summary.duration / 1000}">
  ${report.errors.map(error => `
  <testcase classname="IntegrationTest" name="${error.test}">
    <failure message="${error.error}"></failure>
  </testcase>`).join('')}
</testsuite>`;

    const reportPath = path.join('./test-results', 'junit.xml');
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, xml);
    
    if (this.config.isVerbose()) {
      console.log(`JUnit report generated: ${reportPath}`);
    }
  }

  generateGithubActionsReport(report) {
    if (process.env.GITHUB_ACTIONS) {
      console.log(`::notice::Tests completed: ${report.summary.passed} passed, ${report.summary.failed} failed`);
      
      report.errors.forEach(error => {
        console.log(`::error::Test failed - ${error.test}: ${error.error}`);
      });
    }
  }
}

module.exports = TestRunner;