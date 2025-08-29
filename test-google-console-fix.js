#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Google Cloud Console Fix Status\n');
console.log('═══════════════════════════════════════════\n');

// Load environment variables
function loadEnvVars() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/"/g, '');
      }
    });
    
    return true;
  } catch (error) {
    console.log('❌ Failed to load .env.local:', error.message);
    return false;
  }
}

// Test with different authorization codes to determine Google Cloud Console status
async function testGoogleConsoleStatus() {
  console.log('🧪 Testing Google Cloud Console Configuration Status:');
  console.log('═══════════════════════════════════════════════════');
  
  const testCases = [
    {
      name: 'Test 1: Invalid auth code (should show Google Console status)',
      code: 'test_invalid_auth_code_12345'
    },
    {
      name: 'Test 2: Another invalid code pattern',
      code: 'invalid_grant_test_67890'
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n${testCase.name}:`);
    console.log('─'.repeat(50));
    
    const result = await makeOAuthRequest(testCase.code);
    
    if (result.status === 500 && result.message === 'invalid_grant') {
      console.log('❌ STILL "invalid_grant" - Google Cloud Console NOT fixed yet');
      console.log('   → Multiple redirect URIs still configured');
      
      if (i === 0) {
        console.log('\n⏰ Status Check:');
        console.log('   - Have you edited the Google Cloud Console?');
        console.log('   - Did you remove ALL redirect URIs except http://localhost:3000?');
        console.log('   - How long ago did you make the change?');
        console.log('   - Google takes 5-10 minutes to propagate changes');
      }
    } else if (result.status === 500 && result.message !== 'invalid_grant') {
      console.log('✅ PROGRESS! "invalid_grant" error is FIXED!');
      console.log(`   → New error: ${result.message}`);
      console.log('   → Google Cloud Console configuration is now correct');
      break;
    } else if (result.status === 400) {
      console.log('✅ EXCELLENT! OAuth endpoint working correctly');
      console.log('   → Proper validation of invalid auth codes');
      break;
    } else {
      console.log(`⚠️  Unexpected response: Status ${result.status}, Message: ${result.message}`);
    }
    
    // Wait a bit between tests
    if (i < testCases.length - 1) {
      console.log('\n⏳ Waiting 3 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

// Make OAuth request
function makeOAuthRequest(code) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ code });
    
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
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            status: res.statusCode,
            message: response.message || 'No message'
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            message: 'Invalid JSON response'
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
  if (!loadEnvVars()) {
    console.log('❌ Cannot proceed without environment variables');
    return;
  }
  
  await testGoogleConsoleStatus();
  
  console.log('\n📋 Summary:');
  console.log('═══════════');
  console.log('If you\'re still seeing "invalid_grant":');
  console.log('1. ✅ Verify you edited the "kinir" OAuth client in Google Cloud Console');
  console.log('2. ✅ Ensure ONLY http://localhost:3000 is in "Authorized redirect URIs"');
  console.log('3. ✅ Removed all other redirect URIs (3001, 3003, 3004)');
  console.log('4. ⏰ Wait up to 10 minutes for Google to propagate changes');
  console.log('5. 🧪 Run this test again to check status');
  console.log('\nOnce fixed, test the actual OAuth flow at: http://localhost:3000/login');
}

main().catch(console.error);