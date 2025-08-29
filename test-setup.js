#!/usr/bin/env node

const http = require('http');
const https = require('https');

console.log('🧪 Testing Google OAuth Setup\n');

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testServer(name, url) {
  try {
    console.log(`🔍 Testing ${name}...`);
    const response = await makeRequest(url);
    
    if (response.status === 200 || response.status === 404) {
      console.log(`✅ ${name} is running (Status: ${response.status})`);
      return true;
    } else {
      console.log(`⚠️ ${name} responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} is not accessible: ${error.message}`);
    return false;
  }
}

async function testGoogleAuth() {
  try {
    console.log('🔍 Testing Google OAuth API endpoint...');
    const response = await makeRequest('http://localhost:3000/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code: 'test_code' })
    });
    
    console.log(`📋 Google OAuth API Status: ${response.status}`);
    console.log(`📄 Response: ${response.data.substring(0, 200)}...`);
    
    if (response.status === 400 || response.status === 500) {
      console.log('✅ Google OAuth endpoint is responding (expected error with test data)');
      return true;
    }
    
    return false;
  } catch (error) {
    console.log(`❌ Google OAuth endpoint error: ${error.message}`);
    return false;
  }
}

async function checkEnvironment() {
  console.log('🔍 Checking environment variables...');
  
  const requiredVars = [
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ];
  
  let allSet = true;
  
  for (const varName of requiredVars) {
    if (process.env[varName] && !process.env[varName].includes('your_')) {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`❌ ${varName}: Not configured`);
      allSet = false;
    }
  }
  
  return allSet;
}

async function runTests() {
  console.log('🚀 Starting comprehensive setup test...\n');
  
  // Test 1: Environment Variables
  const envOk = await checkEnvironment();
  console.log('');
  
  // Test 2: Frontend Server
  const frontendOk = await testServer('Frontend (Next.js)', 'http://localhost:3000');
  console.log('');
  
  // Test 3: Backend Server  
  const backendOk = await testServer('Backend (Express)', 'http://localhost:5000/api/health');
  console.log('');
  
  // Test 4: Google OAuth API
  const oauthOk = await testGoogleAuth();
  console.log('');
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log('=' .repeat(40));
  console.log(`Environment Variables: ${envOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend Server: ${frontendOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Backend Server: ${backendOk ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Google OAuth API: ${oauthOk ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = envOk && frontendOk && backendOk && oauthOk;
  
  console.log('\n🎯 Overall Status:');
  if (allPassed) {
    console.log('🎉 All tests passed! Google OAuth is ready for testing.');
    console.log('\n🔗 Next steps:');
    console.log('   1. Open: http://localhost:3000/login');
    console.log('   2. Click "Continue with Google"');
    console.log('   3. Complete the OAuth flow');
  } else {
    console.log('⚠️ Some tests failed. Please address the issues above.');
    console.log('\n🔧 Troubleshooting:');
    if (!envOk) console.log('   - Run: npm run setup:google');
    if (!frontendOk) console.log('   - Run: npm run dev');
    if (!backendOk) console.log('   - Run: cd backend && npm start');
    if (!oauthOk) console.log('   - Check frontend and backend are both running');
  }
}

runTests().catch(console.error);