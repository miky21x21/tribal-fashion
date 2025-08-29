#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 Google OAuth Fix Verification\n');
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

// Test server connectivity
async function checkServers() {
  console.log('🌐 1. Server Connectivity Check:');
  console.log('═══════════════════════════════════');
  
  const testServer = (url, name) => {
    return new Promise((resolve) => {
      const req = http.get(url, (res) => {
        console.log(`✅ ${name}: Running (Status: ${res.statusCode})`);
        resolve(true);
      });
      
      req.on('error', () => {
        console.log(`❌ ${name}: NOT Running`);
        resolve(false);
      });
      
      req.setTimeout(3000, () => {
        console.log(`❌ ${name}: Timeout`);
        req.destroy();
        resolve(false);
      });
    });
  };
  
  const frontendOk = await testServer('http://localhost:3000', 'Frontend (port 3000)');
  const backendOk = await testServer('http://localhost:5000', 'Backend (port 5000)');
  
  return { frontendOk, backendOk };
}

// Test OAuth configuration
function checkOAuthConfig() {
  console.log('\n🔧 2. OAuth Configuration Check:');
  console.log('═══════════════════════════════════');
  
  const requiredVars = [
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_ID', 
    'GOOGLE_CLIENT_SECRET'
  ];
  
  let allSet = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: Set`);
    } else {
      console.log(`❌ ${varName}: Missing`);
      allSet = false;
    }
  });
  
  // Check if frontend and Google client IDs match
  const frontendId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const googleId = process.env.GOOGLE_CLIENT_ID;
  
  if (frontendId === googleId) {
    console.log('✅ Client IDs match');
  } else {
    console.log('❌ Client IDs do NOT match');
    allSet = false;
  }
  
  return allSet;
}

// Test current OAuth endpoint behavior
async function testCurrentOAuth() {
  console.log('\n🧪 3. OAuth Endpoint Test:');
  console.log('═══════════════════════════════');
  
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      code: 'test_invalid_code_12345'
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
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        
        try {
          const response = JSON.parse(data);
          console.log(`Message: ${response.message}`);
          
          if (res.statusCode === 500 && response.message === 'invalid_grant') {
            console.log('❌ Still getting "invalid_grant" - Google Cloud Console fix needed');
            console.log('   → Multiple redirect URIs likely still configured');
            resolve('needs_fix');
          } else if (res.statusCode === 500) {
            console.log('⚠️  Different 500 error - progress made');
            console.log(`   → New error: ${response.message}`);
            resolve('different_error');
          } else {
            console.log('✅ No 500 error - OAuth route responding correctly');
            resolve('fixed');
          }
        } catch (e) {
          console.log('❌ Invalid response format');
          resolve('invalid_response');
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ Request failed: ${err.message}`);
      resolve('request_failed');
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Request timeout');
      req.destroy();
      resolve('timeout');
    });
    
    req.write(postData);
    req.end();
  });
}

// Main verification function
async function main() {
  if (!loadEnvVars()) {
    console.log('❌ Cannot proceed without environment variables');
    return;
  }
  
  const { frontendOk, backendOk } = await checkServers();
  const configOk = checkOAuthConfig();
  const oauthResult = await testCurrentOAuth();
  
  console.log('\n📋 4. Verification Summary:');
  console.log('═══════════════════════════════');
  
  if (!frontendOk || !backendOk) {
    console.log('❌ CRITICAL: Servers not running');
    console.log('\n🚀 Start servers:');
    console.log('   Frontend: npm run dev');
    console.log('   Backend: cd backend && npm start');
    return;
  }
  
  if (!configOk) {
    console.log('❌ CRITICAL: OAuth configuration issues');
    console.log('\n🔧 Fix environment variables in .env.local');
    return;
  }
  
  console.log('✅ Servers running');
  console.log('✅ OAuth configuration correct');
  
  if (oauthResult === 'needs_fix') {
    console.log('\n🎯 NEXT STEPS - Google Cloud Console Fix Required:');
    console.log('1. Go to: https://console.developers.google.com/apis/credentials');
    console.log('2. Edit your "kinir" OAuth client');
    console.log('3. In "Authorized redirect URIs", keep ONLY: http://localhost:3000');
    console.log('4. Remove ALL other redirect URIs (3001, 3003, 3004)');
    console.log('5. Save and wait 5-10 minutes');
    console.log('6. Test again in incognito mode');
  } else if (oauthResult === 'different_error') {
    console.log('\n🎉 PROGRESS: "invalid_grant" error fixed!');
    console.log('Now working on next error in the OAuth flow');
  } else if (oauthResult === 'fixed') {
    console.log('\n🎉 SUCCESS: OAuth endpoint working correctly!');
    console.log('Ready to test actual Google login flow');
  }
  
  console.log('\n🌐 Test the actual flow after fixes:');
  console.log('   1. Open incognito window');
  console.log('   2. Go to: http://localhost:3000/login');
  console.log('   3. Click: Continue with Google');
  console.log('   4. Complete OAuth flow');
}

main().catch(console.error);