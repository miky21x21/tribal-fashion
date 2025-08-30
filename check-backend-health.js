#!/usr/bin/env node

const http = require('http');

console.log('🔍 Backend Server Health Check\n');
console.log('═══════════════════════════════\n');

// Test basic backend connectivity
function testBasicEndpoint() {
  return new Promise((resolve) => {
    console.log('Testing basic backend endpoint...');
    
    const req = http.get('http://localhost:5000', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Basic endpoint: Accessible');
        console.log(`   Status: ${res.statusCode}`);
        resolve(true);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Basic endpoint: Failed');
      console.log(`   Error: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Basic endpoint: Timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Test OAuth endpoint with minimal data
function testOAuthEndpointSimple() {
  return new Promise((resolve) => {
    console.log('\nTesting OAuth endpoint with empty request...');
    
    const postData = JSON.stringify({});
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/oauth/google',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ OAuth endpoint: Responding');
        console.log(`   Status: ${res.statusCode}`);
        try {
          const response = JSON.parse(data);
          console.log(`   Message: ${response.message || 'No message'}`);
        } catch (e) {
          console.log(`   Response: ${data.substring(0, 100)}...`);
        }
        resolve(true);
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ OAuth endpoint: Failed');
      console.log(`   Error: ${err.message}`);
      console.log(`   Code: ${err.code}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ OAuth endpoint: Timeout');
      req.destroy();
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Test if backend has required dependencies
function testBackendRoutes() {
  return new Promise((resolve) => {
    console.log('\nTesting backend route structure...');
    
    const req = http.get('http://localhost:5000/api/auth', (res) => {
      console.log('✅ Auth routes: Available');
      console.log(`   Status: ${res.statusCode}`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      if (err.code === 'ECONNRESET') {
        console.log('⚠️  Auth routes: Server drops connection (possible crash)');
        console.log('   This suggests the backend server may be crashing on requests');
      } else {
        console.log('❌ Auth routes: Failed');
        console.log(`   Error: ${err.message}`);
      }
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Auth routes: Timeout');
      req.destroy();
      resolve(false);
    });
  });
}

async function runHealthCheck() {
  const basicOk = await testBasicEndpoint();
  const routesOk = await testBackendRoutes();
  const oauthOk = await testOAuthEndpointSimple();
  
  console.log('\n📊 Health Check Summary:');
  console.log('═══════════════════════════');
  
  if (!basicOk) {
    console.log('❌ Backend server is not responding at all');
    console.log('🛠️  Solution: Restart backend server');
    console.log('   cd backend && npm start');
  } else if (!routesOk || !oauthOk) {
    console.log('⚠️  Backend server starts but crashes on requests');
    console.log('🛠️  Possible causes:');
    console.log('   1. Missing environment variables in backend/.env');
    console.log('   2. Database connection issues');
    console.log('   3. Missing dependencies');
    console.log('   4. Code syntax errors');
    console.log('\n🔧 Recommended fixes:');
    console.log('   1. Check backend console for error messages');
    console.log('   2. Verify backend/.env has all required variables');
    console.log('   3. Run: cd backend && npm install');
    console.log('   4. Restart backend server');
  } else {
    console.log('✅ Backend server is healthy and responding');
    console.log('🎯 OAuth issue might be in the specific authentication logic');
  }
}

runHealthCheck().catch(console.error);