#!/usr/bin/env node

const http = require('http');

console.log('🔍 Testing Server Connectivity\n');
console.log('═══════════════════════════════\n');

// Test frontend server
const testFrontend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      console.log('✅ Frontend server: RUNNING on port 3000');
      resolve(true);
    });
    
    req.on('error', () => {
      console.log('❌ Frontend server: NOT RUNNING on port 3000');
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      console.log('❌ Frontend server: TIMEOUT (not responding)');
      req.destroy();
      resolve(false);
    });
  });
};

// Test backend server
const testBackend = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000', (res) => {
      console.log('✅ Backend server: RUNNING on port 5000');
      resolve(true);
    });
    
    req.on('error', () => {
      console.log('❌ Backend server: NOT RUNNING on port 5000');
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      console.log('❌ Backend server: TIMEOUT (not responding)');
      req.destroy();
      resolve(false);
    });
  });
};

// Test backend OAuth endpoint
const testOAuthEndpoint = () => {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      idToken: 'test'
    });
    
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
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 400) {
          console.log('✅ OAuth endpoint: ACCESSIBLE (returns 400 for invalid token as expected)');
        } else {
          console.log(`✅ OAuth endpoint: ACCESSIBLE (status: ${res.statusCode})`);
        }
        resolve(true);
      });
    });
    
    req.on('error', () => {
      console.log('❌ OAuth endpoint: NOT ACCESSIBLE');
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      console.log('❌ OAuth endpoint: TIMEOUT');
      req.destroy();
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
};

async function runTests() {
  const frontendOk = await testFrontend();
  const backendOk = await testBackend();
  
  console.log();
  
  if (backendOk) {
    await testOAuthEndpoint();
  }
  
  console.log('\n📊 Summary:');
  console.log('═══════════');
  
  if (frontendOk && backendOk) {
    console.log('✅ All servers running - Ready to test Google OAuth!');
    console.log('\n🚀 Next Steps:');
    console.log('1. Open: http://localhost:3000/login');
    console.log('2. Click "Continue with Google"');
    console.log('3. Complete OAuth flow');
  } else {
    console.log('❌ Server connectivity issues detected');
    console.log('\n🔧 Fix Required:');
    if (!frontendOk) console.log('- Start frontend: npm run dev');
    if (!backendOk) console.log('- Start backend: cd backend && npm start');
  }
}

runTests().catch(console.error);