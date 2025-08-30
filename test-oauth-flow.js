#!/usr/bin/env node

const http = require('http');

console.log('🔍 Google OAuth Flow Test\n');
console.log('═════════════════════════\n');

// Test the frontend Google OAuth API route
function testFrontendOAuthRoute() {
  return new Promise((resolve) => {
    console.log('Testing frontend OAuth API route...');
    
    const postData = JSON.stringify({
      code: 'test_authorization_code'
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
        console.log('✅ Frontend OAuth route: Accessible');
        console.log(`   Status: ${res.statusCode}`);
        
        try {
          const response = JSON.parse(data);
          console.log(`   Response: ${response.message || 'No message'}`);
          
          if (res.statusCode === 500 && response.message && response.message.includes('invalid_grant')) {
            console.log('   ℹ️  Expected error - test auth code is invalid (this is normal)');
            resolve(true);
          } else if (res.statusCode === 500 && response.message && response.message.includes('Google OAuth is not configured properly')) {
            console.log('   ❌ Google OAuth client not initialized properly');
            resolve(false);
          } else {
            resolve(true);
          }
        } catch (e) {
          console.log(`   Raw response: ${data.substring(0, 200)}...`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Frontend OAuth route: Failed');
      console.log(`   Error: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log('❌ Frontend OAuth route: Timeout');
      req.destroy();
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Test backend OAuth endpoint with proper data
function testBackendOAuthWithValidData() {
  return new Promise((resolve) => {
    console.log('\nTesting backend OAuth with mock ID token...');
    
    const postData = JSON.stringify({
      idToken: 'mock_google_id_token_for_testing',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      googleId: 'test123',
      avatar: 'https://example.com/avatar.jpg'
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
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Backend OAuth endpoint: Responding');
        console.log(`   Status: ${res.statusCode}`);
        
        try {
          const response = JSON.parse(data);
          console.log(`   Response: ${response.message || 'No message'}`);
          
          if (res.statusCode === 500 && response.message && response.message.includes('Failed to authenticate with Google')) {
            console.log('   ℹ️  Expected error - mock token is invalid (this is normal)');
            resolve(true);
          } else {
            resolve(true);
          }
        } catch (e) {
          console.log(`   Raw response: ${data.substring(0, 200)}...`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ Backend OAuth endpoint: Failed');
      console.log(`   Error: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(10000, () => {
      console.log('❌ Backend OAuth endpoint: Timeout');
      req.destroy();
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

async function runOAuthFlowTest() {
  const frontendOk = await testFrontendOAuthRoute();
  const backendOk = await testBackendOAuthWithValidData();
  
  console.log('\n📊 OAuth Flow Test Summary:');
  console.log('═══════════════════════════════');
  
  if (frontendOk && backendOk) {
    console.log('✅ OAuth flow infrastructure is working');
    console.log('\n🎯 Likely causes of "Failed to authenticate with Google":');
    console.log('1. Invalid Google authorization code from popup');
    console.log('2. Google Cloud Console client configuration');
    console.log('3. Browser blocking popups or cookies');
    console.log('4. Network connectivity issues during OAuth');
    console.log('\n🔧 Debugging steps:');
    console.log('1. Open browser Developer Tools (F12)');
    console.log('2. Go to Console tab');
    console.log('3. Try Google login and check for errors');
    console.log('4. Check Network tab for failed requests');
    console.log('5. Try in incognito/private browsing mode');
  } else {
    console.log('❌ OAuth flow has infrastructure issues:');
    if (!frontendOk) {
      console.log('   - Frontend OAuth API route problems');
      console.log('   - Check environment variables in .env.local');
      console.log('   - Restart frontend server');
    }
    if (!backendOk) {
      console.log('   - Backend OAuth endpoint problems');
      console.log('   - Check environment variables in backend/.env');
      console.log('   - Restart backend server');
    }
  }
  
  console.log('\n🌐 Test the actual flow:');
  console.log('   Open: http://localhost:3000/login');
  console.log('   Click: Continue with Google');
  console.log('   Watch: Browser console for specific errors');
}

runOAuthFlowTest().catch(console.error);