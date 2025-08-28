const fs = require('fs');
const path = require('path');

class TestConfig {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.testEnv = process.env.TEST_ENV || 'dev';
    this.config = null;
    this.load();
  }

  load() {
    const configFile = `test.${this.testEnv}.json`;
    const configPath = path.join(process.cwd(), 'config', configFile);

    try {
      if (!fs.existsSync(configPath)) {
        throw new Error(`Configuration file not found: ${configPath}`);
      }

      const rawConfig = fs.readFileSync(configPath, 'utf8');
      this.config = JSON.parse(rawConfig);
      
      // Replace environment variables in configuration
      this.replaceEnvVariables(this.config);
      
      console.log(`Loaded test configuration for environment: ${this.testEnv}`);
    } catch (error) {
      throw new Error(`Failed to load test configuration: ${error.message}`);
    }
  }

  replaceEnvVariables(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.replaceEnvVariables(obj[key]);
      } else if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/\$\{([^}]+)\}/g, (match, envVar) => {
          const value = process.env[envVar];
          if (value === undefined) {
            throw new Error(`Environment variable ${envVar} is not defined`);
          }
          return value;
        });
      }
    }
  }

  get(path) {
    const keys = path.split('.');
    let value = this.config;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  getDatabaseUrl() {
    return this.get('database.url');
  }

  getApiBaseUrl() {
    return this.get('api.baseUrl');
  }

  getTestTimeout() {
    return this.get('test.timeout') || 30000;
  }

  shouldSeedData() {
    return this.get('test.seedData') !== false;
  }

  shouldCleanupAfterTests() {
    return this.get('test.cleanupAfterTests') !== false;
  }

  canRunParallelTests() {
    return this.get('test.parallelTests') === true;
  }

  getMaxParallelTests() {
    return this.get('test.maxParallel') || 1;
  }

  isVerbose() {
    return this.get('test.verbose') === true;
  }

  getLogLevel() {
    return this.get('logging.level') || 'info';
  }

  shouldLogToConsole() {
    return this.get('logging.enableConsole') !== false;
  }

  shouldLogToFile() {
    return this.get('logging.enableFile') === true;
  }

  getLogFilePath() {
    return this.get('logging.filePath') || './logs/test.log';
  }

  getJwtSecret() {
    return this.get('auth.jwtSecret');
  }

  getTokenExpiry() {
    return this.get('auth.tokenExpiry') || '1h';
  }

  getApiTimeout() {
    return this.get('api.timeout') || 10000;
  }

  getApiRetries() {
    return this.get('api.retries') || 3;
  }

  getDatabaseTimeout() {
    return this.get('database.timeout') || 30000;
  }

  getDatabaseMaxConnections() {
    return this.get('database.maxConnections') || 5;
  }

  getTestReporters() {
    return this.get('test.reporters') || ['console'];
  }
}

module.exports = TestConfig;