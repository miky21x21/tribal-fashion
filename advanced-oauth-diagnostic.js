#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 Advanced Google OAuth Diagnostic\n');
console.log('═══════════════════════════════════\n');

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

// Check Google OAuth Client initialization
function checkGoogleClientInit() {
  console.log('🔧 1. Google OAuth Client Check:');
  console.log('═══════════════════════════════════');
  
  try {
    const { OAuth2Client } = require('google-auth-library');
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    console.log(`Client ID: ${clientId ? clientId.substring(0, 20) + '...' : '❌ Missing'}`);
    console.log(`Client Secret: ${clientSecret ? '✅ Set (' + clientSecret.length + ' chars)' : '❌ Missing'}`);
    
    if (clientId && clientSecret) {
      const client = new OAuth2Client(clientId, clientSecret);
      console.log('✅ Google OAuth Client created successfully');
      
      // Check if client ID format is valid
      if (clientId.includes('.apps.googleusercontent.com')) {
        console.log('✅ Client ID format appears valid');
      } else {
        console.log('⚠️  Client ID format may be invalid (should end with .apps.googleusercontent.com)');
      }
      
      return true;
    } else {
      console.log('❌ Missing Google OAuth credentials');
      return false;
    }
  } catch (error) {
    console.log(`❌ Failed to create Google OAuth client: ${error.message}`);
    return false;
  }
}

// Test different scenarios to identify the exact issue
async function testDetailedOAuth() {
  console.log('\n🧪 2. Detailed OAuth Endpoint Tests:');
  console.log('═══════════════════════════════════');
  
  const scenarios = [
    {
      name: 'Missing authorization code',
      data: {},
      expected: '400 - Authorization code is required'
    },
    {
      name: 'Empty authorization code',
      data: { code: '' },
      expected: '400 - Authorization code is required'
    },
    {
      name: 'Invalid authorization code',
      data: { code: 'invalid_test_code' },
      expected: '500 - Should show specific Google error'
    },
    {
      name: 'Malformed authorization code',
      data: { code: '4/0AX4XfWh-malformed-code-example' },
      expected: '500 - Should show specific Google error'
    }
  ];
  
  for (const scenario of scenarios) {
    console.log(`\n🧪 Testing: ${scenario.name}`);
    console.log(`Expected: ${scenario.expected}`);
    console.log('─'.repeat(50));
    
    const result = await makeOAuthRequest(scenario.data);
    console.log(`Actual: ${result.status} - ${result.message}`);
    
    // Analyze the response
    if (result.status === 500 && result.message === 'invalid_grant') {
      console.log('❌ ISSUE: Still getting "invalid_grant"');
      console.log('   Possible causes:');
      console.log('   1. OAuth client in Google Cloud Console is not of type "Web application"');
      console.log('   2. Client ID mismatch between .env.local and Google Cloud Console');
      console.log('   3. OAuth client has been deleted/disabled in Google Cloud Console');
      console.log('   4. Redirect URI is not exactly "http://localhost:3000"');
    } else if (result.status === 400) {
      console.log('✅ GOOD: Proper validation working');
    } else if (result.status === 500 && result.message !== 'invalid_grant') {
      console.log('🎉 PROGRESS: "invalid_grant" is fixed!');
      console.log(`   New error: ${result.message}`);
      console.log('   This means Google Cloud Console configuration is now correct');
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Test specific Google Cloud Console configuration issues
async function testGoogleConsoleIssues() {
  console.log('\n🔍 3. Google Cloud Console Configuration Analysis:');
  console.log('═══════════════════════════════════════════════════');
  
  const testResult = await makeOAuthRequest({ code: 'test_invalid_code_for_diagnosis' });
  
  if (testResult.status === 500 && testResult.message === 'invalid_grant') {
    console.log('❌ DIAGNOSIS: "invalid_grant" indicates Google Cloud Console issues');
    console.log('\n🔧 Please verify these EXACT settings in Google Cloud Console:');
    console.log('   OAuth 2.0 Client: "kinir"');
    console.log('   Application type: Web application');
    console.log('   Authorized JavaScript origins: http://localhost:3000');
    console.log('   Authorized redirect URIs: http://localhost:3000');
    console.log('\n⚠️  Common issues even with "only one redirect URI":');
    console.log('   1. Wrong application type (should be "Web application", not "Desktop")');
    console.log('   2. Redirect URI has typo (missing http://, wrong port, extra characters)');
    console.log('   3. Different OAuth client being used than configured in .env.local');
    console.log('   4. OAuth client status is disabled/deleted');
    
    // Check if the client ID looks correct
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId) {
      console.log('\n🔍 Your current Client ID analysis:');
      console.log(`   Client ID: ${clientId}`);
      
      if (clientId.includes('196192626861')) {
        console.log('   ✅ Matches the expected format from earlier setup');
      }
      
      console.log('\n📋 Verification steps:');
      console.log('   1. Go to Google Cloud Console and find this EXACT Client ID');
      console.log('   2. Verify it shows "Web application" type');
      console.log('   3. Check that Authorized redirect URIs shows EXACTLY: http://localhost:3000');
      console.log('   4. Ensure the client is not deleted/disabled');
    }
  }
}

// Make OAuth request helper
function makeOAuthRequest(data) {
  return new Promise((resolve) => {
    const postData = JSON.stringify(data);
    
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
      let responseData = '';
      res.on('data', (chunk) => responseData += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            message: response.message || 'No message',
            response: response
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            message: 'Invalid JSON response',
            response: responseData
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
  
  const clientOk = checkGoogleClientInit();
  if (!clientOk) {
    console.log('\n❌ Cannot proceed with OAuth client issues');
    return;
  }
  
  await testDetailedOAuth();
  await testGoogleConsoleIssues();
  
  console.log('\n📋 Next Steps:');
  console.log('═══════════════');
  console.log('1. Verify Google Cloud Console settings match exactly as shown above');
  console.log('2. If settings are correct, try creating a new OAuth client');
  console.log('3. Test again with: node test-google-console-fix.js');
  console.log('4. Once "invalid_grant" is resolved, test actual login at http://localhost:3000/login');
}

main().catch(console.error);