#!/usr/bin/env node

const http = require('http');

console.log('🔍 Debugging 500 Internal Server Error\n');
console.log('═══════════════════════════════════════\n');

// Test with different authorization codes to see exact error
async function testOAuthEndpoint() {
  const testCases = [
    {
      name: 'Empty authorization code',
      data: { code: '' }
    },
    {
      name: 'Missing authorization code',
      data: {}
    },
    {
      name: 'Invalid authorization code',
      data: { code: 'invalid_test_code_123' }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Testing: ${testCase.name}`);
    console.log('─'.repeat(40));
    
    await new Promise((resolve) => {
      const postData = JSON.stringify(testCase.data);
      
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
          console.log(`Status: ${res.statusCode}`);
          
          try {
            const response = JSON.parse(data);
            console.log(`Message: ${response.message || 'No message'}`);
            
            if (res.statusCode === 500) {
              console.log('❌ 500 Error Detected');
              console.log(`Error Details: ${JSON.stringify(response, null, 2)}`);
            } else {
              console.log(`✅ Response: ${JSON.stringify(response, null, 2)}`);
            }
          } catch (e) {
            console.log('❌ Invalid JSON response');
            console.log(`Raw Response: ${data}`);
          }
          
          resolve();
        });
      });
      
      req.on('error', (err) => {
        console.log(`❌ Request Failed: ${err.message}`);
        resolve();
      });
      
      req.setTimeout(5000, () => {
        console.log('❌ Request Timeout');
        req.destroy();
        resolve();
      });
      
      req.write(postData);
      req.end();
    });
  }
}

// Test Google OAuth client initialization
function testGoogleClientInit() {
  console.log('🔧 Testing Google OAuth Client Initialization:');
  console.log('═══════════════════════════════════════════════');
  
  try {
    const { OAuth2Client } = require('google-auth-library');
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    
    console.log(`Client ID: ${clientId ? '✅ Set' : '❌ Missing'}`);
    console.log(`Client Secret: ${clientSecret ? '✅ Set' : '❌ Missing'}`);
    
    if (clientId && clientSecret) {
      const client = new OAuth2Client(clientId, clientSecret);
      console.log('✅ Google OAuth Client created successfully');
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

// Load environment variables from .env.local
function loadEnvVars() {
  const fs = require('fs');
  const path = require('path');
  
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/"/g, '');
      }
    });
    
    console.log('✅ Environment variables loaded from .env.local');
    return true;
  } catch (error) {
    console.log('❌ Failed to load .env.local:', error.message);
    return false;
  }
}

async function main() {
  const envLoaded = loadEnvVars();
  
  if (!envLoaded) {
    console.log('\n❌ Cannot proceed without environment variables');
    return;
  }
  
  const clientInitOk = testGoogleClientInit();
  
  if (!clientInitOk) {
    console.log('\n❌ Google OAuth client initialization failed');
    console.log('This could be the cause of the 500 error');
    return;
  }
  
  console.log('\n🌐 Testing OAuth endpoint with different inputs:');
  await testOAuthEndpoint();
  
  console.log('\n📋 Summary:');
  console.log('═══════════');
  console.log('Check the test results above to identify the exact cause of the 500 error.');
  console.log('Common causes:');
  console.log('1. Missing or invalid Google OAuth credentials');
  console.log('2. Google OAuth client initialization failure');
  console.log('3. Backend server not responding');
  console.log('4. Invalid request format');
}

main().catch(console.error);