#!/usr/bin/env node

const http = require('http');

console.log('🔍 Testing Backend OAuth Endpoint\n');
console.log('═══════════════════════════════════\n');

// Test backend OAuth endpoint with different scenarios
async function testBackendOAuth() {
  const testCases = [
    {
      name: 'Missing idToken',
      data: {},
      expectedStatus: 400
    },
    {
      name: 'Empty idToken',
      data: { idToken: '' },
      expectedStatus: 400
    },
    {
      name: 'Invalid idToken format',
      data: { idToken: 'invalid.token.format' },
      expectedStatus: 500
    },
    {
      name: 'Valid format but fake idToken',
      data: { 
        idToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkYzBkOGVkM2QxNjM5NTlmNTUwMTIzMjQ5NjQ5YWU2MjcxYjBkNzUiLCJ0eXAiOiJKV1QifQ.fake.token',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        googleId: 'test123',
        avatar: 'https://example.com/avatar.jpg'
      },
      expectedStatus: 500
    }
  ];

  for (const testCase of testCases) {
    console.log(`🧪 Testing: ${testCase.name}`);
    console.log(`Expected Status: ${testCase.expectedStatus}`);
    console.log('─'.repeat(50));
    
    const result = await makeBackendRequest(testCase.data);
    
    console.log(`Actual Status: ${result.status}`);
    console.log(`Message: ${result.message}`);
    
    if (result.status === testCase.expectedStatus) {
      console.log('✅ Expected response');
    } else {
      console.log('⚠️  Unexpected response');
    }
    
    // Analyze specific responses
    if (result.status === 400 && result.message.includes('Google ID token is required')) {
      console.log('✅ Backend validation working correctly');
    } else if (result.status === 500 && result.message === 'Failed to authenticate with Google') {
      console.log('❌ Backend Google token verification failing');
      console.log('   Possible causes:');
      console.log('   1. Google Client ID mismatch in backend/.env');
      console.log('   2. Google OAuth client configuration issue');
      console.log('   3. Network connectivity issue');
      console.log('   4. Invalid token format from frontend');
    } else if (result.status === 0) {
      console.log('❌ Cannot connect to backend server');
      console.log('   → Make sure backend is running on port 5000');
    }
    
    console.log();
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Test backend server connectivity
async function testBackendConnectivity() {
  console.log('🌐 Testing Backend Server Connectivity:');
  console.log('═══════════════════════════════════════');
  
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/api/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`✅ Backend server: Running (Status: ${res.statusCode})`);
          console.log(`   Server status: ${response.server?.status || 'unknown'}`);
          console.log(`   Database status: ${response.database?.status || 'unknown'}`);
          resolve(true);
        } catch (e) {
          console.log(`✅ Backend server: Running (Status: ${res.statusCode}) - Non-JSON response`);
          resolve(true);
        }
      });
    });
    
    req.on('error', () => {
      console.log('❌ Backend server: NOT Running');
      console.log('   → Start with: cd backend && npm start');
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      console.log('❌ Backend server: Timeout');
      req.destroy();
      resolve(false);
    });
  });
}

// Make request to backend OAuth endpoint
function makeBackendRequest(data) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(data);
    
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
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            message: response.message || 'No message',
            success: response.success,
            data: response.data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            message: 'Invalid JSON response',
            raw: responseData
          });
        }
      });
    });
    
    req.on('error', (err) => {
      resolve({
        status: 0,
        message: `Request failed: ${err.message}`
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        status: 0,
        message: 'Request timeout'
      });
    });
    
    req.write(postData);
    req.end();
  });
}

async function main() {
  // Test backend connectivity first
  const backendOk = await testBackendConnectivity();
  
  if (!backendOk) {
    console.log('\n❌ Cannot proceed - backend server not running');
    console.log('Please start the backend server: cd backend && npm start');
    return;
  }
  
  console.log('\n');
  await testBackendOAuth();
  
  console.log('📋 Summary:');
  console.log('═══════════');
  console.log('1. If backend OAuth validation is working correctly for invalid tokens,');
  console.log('   then the issue is likely with the token verification process.');
  console.log('2. Check that GOOGLE_CLIENT_ID in backend/.env matches frontend .env.local');
  console.log('3. Ensure the Google OAuth client is properly configured in Google Cloud Console');
  console.log('4. The "Failed to authenticate with Google" error occurs during token verification');
}

main().catch(console.error);