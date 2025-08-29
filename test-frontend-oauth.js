#!/usr/bin/env node

const http = require('http');

console.log('🔍 Testing Frontend OAuth Route with Real Request\n');
console.log('═════════════════════════════════════════════════\n');

// Test with a realistic but invalid auth code to see the exact error
function testFrontendOAuthRoute() {
  return new Promise((resolve) => {
    console.log('Testing frontend /api/auth/google with sample auth code...');
    
    const postData = JSON.stringify({
      code: '4/0AeaYSHBw_sample_invalid_auth_code_for_testing'
    });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/google',
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
        console.log(`Status: ${res.statusCode}`);
        
        try {
          const response = JSON.parse(data);
          console.log('Response:', JSON.stringify(response, null, 2));
          
          if (res.statusCode === 500) {
            console.log('\n🔍 500 Error Analysis:');
            console.log('═══════════════════════');
            
            const message = response.message || '';
            
            if (message.includes('Google OAuth is not configured properly')) {
              console.log('❌ Issue: Google OAuth client initialization failed');
              console.log('   Fix: Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local');
            } else if (message.includes('invalid_grant') || message.includes('invalid_request')) {
              console.log('✅ Expected: Invalid test code (this is normal)');
              console.log('   The route is working, real auth codes should work');
            } else if (message.includes('getToken') || message.includes('OAuth2Client')) {
              console.log('❌ Issue: Google Auth Library problem');
              console.log('   Fix: Check google-auth-library dependency');
            } else if (message.includes('fetch') || message.includes('ECONNREFUSED')) {
              console.log('❌ Issue: Backend connection failed');
              console.log('   Fix: Ensure backend server is running on port 5000');
            } else {
              console.log(`❌ Unexpected error: ${message}`);
              console.log('   This needs investigation');
            }
          }
        } catch (e) {
          console.log('❌ Invalid JSON response:');
          console.log(data);
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Request failed:', err.message);
      resolve();
    });
    
    req.setTimeout(10000, () => {
      console.log('❌ Request timeout');
      req.destroy();
      resolve();
    });
    
    req.write(postData);
    req.end();
  });
}

// Test with empty request to check initialization
function testEmptyRequest() {
  return new Promise((resolve) => {
    console.log('\nTesting with empty request to check initialization...');
    
    const postData = JSON.stringify({});
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/google',
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
        console.log(`Status: ${res.statusCode}`);
        
        try {
          const response = JSON.parse(data);
          console.log('Response:', JSON.stringify(response, null, 2));
        } catch (e) {
          console.log('Raw response:', data);
        }
        resolve();
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Request failed:', err.message);
      resolve();
    });
    
    req.write(postData);
    req.end();
  });
}

async function runTest() {
  await testEmptyRequest();
  await testFrontendOAuthRoute();
  
  console.log('\n📋 Summary:');
  console.log('═══════════');
  console.log('This test simulates the exact same request your browser makes.');
  console.log('The error details above should show the root cause of the 500 error.');
}

runTest().catch(console.error);