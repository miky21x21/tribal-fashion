#!/usr/bin/env node

const fs = require('fs');
const http = require('http');

console.log('🔍 Google OAuth Debug Analysis\n');
console.log('═══════════════════════════════\n');

// Check environment variables
function checkEnvironmentVariables() {
  console.log('📊 1. Environment Variables Check:');
  console.log('═══════════════════════════════════');
  
  const envPath = '.env.local';
  const backendEnvPath = 'backend/.env';
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ Frontend .env.local file missing');
    return false;
  }
  
  if (!fs.existsSync(backendEnvPath)) {
    console.log('❌ Backend .env file missing');
    return false;
  }
  
  const frontendEnv = fs.readFileSync(envPath, 'utf8');
  const backendEnv = fs.readFileSync(backendEnvPath, 'utf8');
  
  // Extract variables
  const frontendClientId = frontendEnv.match(/NEXT_PUBLIC_GOOGLE_CLIENT_ID="([^"]+)"/)?.[1];
  const googleClientId = frontendEnv.match(/GOOGLE_CLIENT_ID="([^"]+)"/)?.[1];
  const googleClientSecret = frontendEnv.match(/GOOGLE_CLIENT_SECRET="([^"]+)"/)?.[1];
  const backendClientId = backendEnv.match(/GOOGLE_CLIENT_ID="([^"]+)"/)?.[1];
  const backendSecret = backendEnv.match(/GOOGLE_CLIENT_SECRET="([^"]+)"/)?.[1];
  
  console.log(`Frontend Client ID: ${frontendClientId ? '✅ Set' : '❌ Missing'}`);
  console.log(`Google Client ID: ${googleClientId ? '✅ Set' : '❌ Missing'}`);
  console.log(`Google Client Secret: ${googleClientSecret ? '✅ Set' : '❌ Missing'}`);
  console.log(`Backend Client ID: ${backendClientId ? '✅ Set' : '❌ Missing'}`);
  console.log(`Backend Secret: ${backendSecret ? '✅ Set' : '❌ Missing'}`);
  
  // Check consistency
  if (frontendClientId && googleClientId) {
    if (frontendClientId === googleClientId) {
      console.log('✅ Frontend Client IDs match');
    } else {
      console.log('❌ CRITICAL: Frontend Client IDs do NOT match');
      return false;
    }
  }
  
  if (googleClientId && backendClientId) {
    if (googleClientId === backendClientId) {
      console.log('✅ Frontend-Backend Client IDs match');
    } else {
      console.log('❌ CRITICAL: Frontend-Backend Client IDs do NOT match');
      return false;
    }
  }
  
  return true;
}

// Test server connectivity
async function testServers() {
  console.log('\n🌐 2. Server Connectivity Test:');
  console.log('═══════════════════════════════════');
  
  const testServer = (url, name) => {
    return new Promise((resolve) => {
      const req = http.get(url, (res) => {
        console.log(`✅ ${name}: Running`);
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
  
  return frontendOk && backendOk;
}

// Test OAuth endpoint
async function testOAuthEndpoint() {
  console.log('\n🔐 3. OAuth Endpoint Test:');
  console.log('═════════════════════════════');
  
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      idToken: 'invalid_test_token'
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
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 400 && response.message && response.message.includes('Google ID token is required')) {
            console.log('✅ OAuth endpoint: Accessible and responding correctly');
            resolve(true);
          } else if (res.statusCode === 500) {
            console.log('⚠️  OAuth endpoint: Accessible but may have configuration issues');
            console.log(`   Response: ${response.message || 'Unknown error'}`);
            resolve(false);
          } else {
            console.log(`✅ OAuth endpoint: Accessible (status: ${res.statusCode})`);
            resolve(true);
          }
        } catch (e) {
          console.log('⚠️  OAuth endpoint: Accessible but invalid response format');
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log('❌ OAuth endpoint: NOT accessible');
      console.log(`   Error: ${err.message}`);
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      console.log('❌ OAuth endpoint: Timeout');
      req.destroy();
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Main diagnostic function
async function runDiagnostics() {
  const envOk = checkEnvironmentVariables();
  const serversOk = await testServers();
  const oauthOk = await testOAuthEndpoint();
  
  console.log('\n📋 4. Diagnostic Summary:');
  console.log('════════════════════════════');
  
  if (envOk && serversOk && oauthOk) {
    console.log('✅ All checks passed - Configuration appears correct');
    console.log('\n🔍 If still failing, check:');
    console.log('1. Browser console for specific error messages');
    console.log('2. Google Cloud Console OAuth client status');
    console.log('3. Network connectivity issues');
    console.log('4. Try in incognito/private browsing mode');
  } else {
    console.log('❌ Issues detected:');
    if (!envOk) console.log('   - Environment variable problems');
    if (!serversOk) console.log('   - Server connectivity issues');
    if (!oauthOk) console.log('   - OAuth endpoint problems');
    
    console.log('\n🛠️  Immediate fixes needed:');
    if (!envOk) {
      console.log('1. Fix environment variables in .env.local and backend/.env');
      console.log('   - Ensure Client IDs match between frontend and backend');
      console.log('   - Verify Google Client Secret is set');
    }
    if (!serversOk) {
      console.log('2. Start missing servers:');
      console.log('   - Frontend: npm run dev');
      console.log('   - Backend: cd backend && npm start');
    }
    if (!oauthOk) {
      console.log('3. Check backend OAuth configuration');
      console.log('   - Verify Google Client ID in backend/.env');
      console.log('   - Restart backend server after env changes');
    }
  }
  
  console.log('\n📄 See troubleshooting guides:');
  console.log('   - INVALID_REQUEST_FIX.md');
  console.log('   - DELETED_CLIENT_FIX.md');
  console.log('   - READY_TO_TEST.md');
}

runDiagnostics().catch(console.error);