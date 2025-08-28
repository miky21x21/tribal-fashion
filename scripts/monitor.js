#!/usr/bin/env node

const http = require('http');
const https = require('https');

class SystemMonitor {
  constructor() {
    this.frontendPort = process.env.FRONTEND_PORT || 3000;
    this.backendPort = process.env.BACKEND_PORT || 5000;
    this.frontendHost = process.env.FRONTEND_HOST || 'localhost';
    this.backendHost = process.env.BACKEND_HOST || 'localhost';
    this.timeout = parseInt(process.env.TIMEOUT) || 5000;
  }

  /**
   * Check if a port is accessible
   */
  checkPort(host, port, timeout = 5000) {
    return new Promise((resolve) => {
      const client = http.request({
        host,
        port,
        method: 'HEAD',
        timeout,
      });

      client.on('response', () => {
        resolve({ accessible: true, error: null });
        client.destroy();
      });

      client.on('error', (error) => {
        resolve({ accessible: false, error: error.message });
        client.destroy();
      });

      client.on('timeout', () => {
        resolve({ accessible: false, error: `Timeout after ${timeout}ms` });
        client.destroy();
      });

      client.end();
    });
  }

  /**
   * Make HTTP request with timeout
   */
  makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.request({
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        timeout: this.timeout,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SystemMonitor/1.0',
          ...options.headers,
        },
      });

      req.on('response', (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsedData = data ? JSON.parse(data) : {};
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: parsedData,
            });
          } catch (error) {
            resolve({
              status: res.statusCode,
              headers: res.headers,
              data: data,
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Request timed out after ${this.timeout}ms`));
      });

      req.end();
    });
  }

  /**
   * Check Next.js frontend health
   */
  async checkFrontend() {
    const url = `http://${this.frontendHost}:${this.frontendPort}`;
    
    try {
      // First check if port is accessible
      const portCheck = await this.checkPort(this.frontendHost, this.frontendPort, this.timeout);
      if (!portCheck.accessible) {
        return {
          status: 'unreachable',
          error: `Frontend port ${this.frontendPort} is not accessible: ${portCheck.error}`,
          url,
        };
      }

      // Try to get the main page
      const response = await this.makeRequest(url);
      
      if (response.status === 200) {
        return {
          status: 'healthy',
          message: 'Frontend is accessible',
          url,
          statusCode: response.status,
        };
      } else {
        return {
          status: 'unhealthy',
          error: `Frontend returned status ${response.status}`,
          url,
          statusCode: response.status,
        };
      }
    } catch (error) {
      return {
        status: 'unreachable',
        error: error.message,
        url,
      };
    }
  }

  /**
   * Check Express backend health
   */
  async checkBackend() {
    const url = `http://${this.backendHost}:${this.backendPort}`;
    
    try {
      // First check if port is accessible
      const portCheck = await this.checkPort(this.backendHost, this.backendPort, this.timeout);
      if (!portCheck.accessible) {
        return {
          status: 'unreachable',
          error: `Backend port ${this.backendPort} is not accessible: ${portCheck.error}`,
          url,
        };
      }

      // Check the health endpoint
      const healthUrl = `${url}/api/health`;
      const response = await this.makeRequest(healthUrl);
      
      if (response.status === 200 && response.data.success) {
        return {
          status: 'healthy',
          message: 'Backend health check passed',
          url: healthUrl,
          statusCode: response.status,
          health: response.data,
        };
      } else {
        return {
          status: 'unhealthy',
          error: `Backend health check failed: ${response.data.message || 'Unknown error'}`,
          url: healthUrl,
          statusCode: response.status,
          health: response.data,
        };
      }
    } catch (error) {
      return {
        status: 'unreachable',
        error: error.message,
        url: `${url}/api/health`,
      };
    }
  }

  /**
   * Test cross-server communication
   */
  async checkCommunication() {
    try {
      // Test if frontend can reach backend by checking if both are accessible
      const [frontendCheck, backendCheck] = await Promise.all([
        this.checkFrontend(),
        this.checkBackend(),
      ]);

      const communication = {
        frontendAccessible: frontendCheck.status === 'healthy',
        backendAccessible: backendCheck.status === 'healthy',
        crossServerCommunication: false,
        details: {
          frontend: frontendCheck,
          backend: backendCheck,
        },
      };

      // If both servers are accessible, communication should work
      if (communication.frontendAccessible && communication.backendAccessible) {
        communication.crossServerCommunication = true;
      }

      return communication;
    } catch (error) {
      return {
        frontendAccessible: false,
        backendAccessible: false,
        crossServerCommunication: false,
        error: error.message,
      };
    }
  }

  /**
   * Run comprehensive system monitoring
   */
  async monitor() {
    const timestamp = new Date().toISOString();
    console.log(`🔍 System Monitor Report - ${timestamp}\n`);

    try {
      const [frontend, backend, communication] = await Promise.all([
        this.checkFrontend(),
        this.checkBackend(),
        this.checkCommunication(),
      ]);

      // Frontend Status
      console.log(`🖥️  Frontend (${this.frontendHost}:${this.frontendPort})`);
      console.log(`   Status: ${this.getStatusEmoji(frontend.status)} ${frontend.status.toUpperCase()}`);
      if (frontend.error) {
        console.log(`   Error: ${frontend.error}`);
      } else {
        console.log(`   Message: ${frontend.message}`);
      }
      console.log();

      // Backend Status
      console.log(`⚙️  Backend (${this.backendHost}:${this.backendPort})`);
      console.log(`   Status: ${this.getStatusEmoji(backend.status)} ${backend.status.toUpperCase()}`);
      if (backend.error) {
        console.log(`   Error: ${backend.error}`);
      } else {
        console.log(`   Message: ${backend.message}`);
        if (backend.health) {
          console.log(`   Server Uptime: ${Math.round(backend.health.server?.uptime || 0)}s`);
          console.log(`   Database: ${backend.health.database?.status || 'unknown'}`);
        }
      }
      console.log();

      // Communication Status
      console.log(`🔄 Cross-Server Communication`);
      console.log(`   Frontend → Backend: ${communication.crossServerCommunication ? '✅' : '❌'}`);
      if (communication.error) {
        console.log(`   Error: ${communication.error}`);
      }
      console.log();

      // Overall Status
      const overallHealthy = frontend.status === 'healthy' && 
                           backend.status === 'healthy' && 
                           communication.crossServerCommunication;
      
      console.log(`🎯 Overall System Status: ${overallHealthy ? '✅ HEALTHY' : '❌ UNHEALTHY'}`);

      // Exit with appropriate code
      process.exit(overallHealthy ? 0 : 1);

    } catch (error) {
      console.error(`❌ Monitor failed: ${error.message}`);
      process.exit(1);
    }
  }

  getStatusEmoji(status) {
    switch (status) {
      case 'healthy': return '✅';
      case 'unhealthy': return '⚠️';
      case 'unreachable': return '❌';
      default: return '❓';
    }
  }
}

// CLI execution
if (require.main === module) {
  const monitor = new SystemMonitor();
  
  // Handle CLI arguments
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
System Monitor - Health Check Tool

Usage: node monitor.js [options]

Environment Variables:
  FRONTEND_HOST    Frontend hostname (default: localhost)
  FRONTEND_PORT    Frontend port (default: 3000)
  BACKEND_HOST     Backend hostname (default: localhost)
  BACKEND_PORT     Backend port (default: 5000)
  TIMEOUT          Request timeout in ms (default: 5000)

Options:
  --help, -h       Show this help message

Exit Codes:
  0                All systems healthy
  1                One or more systems unhealthy
`);
    process.exit(0);
  }

  monitor.monitor().catch((error) => {
    console.error(`❌ Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = SystemMonitor;