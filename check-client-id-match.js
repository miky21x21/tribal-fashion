#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Google Client ID Consistency\n');
console.log('═══════════════════════════════════════\n');

// Load frontend environment variables
function loadFrontendEnv() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const env = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        env[key.trim()] = value.trim().replace(/"/g, '');
      }
    });
    
    return env;
  } catch (error) {
    console.log('❌ Failed to load frontend .env.local:', error.message);
    return null;
  }
}

// Load backend environment variables
function loadBackendEnv() {
  try {
    const envPath = path.join(__dirname, 'backend', '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const env = {};
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        env[key.trim()] = value.trim().replace(/"/g, '');
      }
    });
    
    return env;
  } catch (error) {
    console.log('❌ Failed to load backend .env:', error.message);
    return null;
  }
}

function main() {
  const frontendEnv = loadFrontendEnv();
  const backendEnv = loadBackendEnv();
  
  if (!frontendEnv || !backendEnv) {
    console.log('❌ Cannot proceed without environment files');
    return;
  }
  
  console.log('📊 Environment Variable Comparison:');
  console.log('═══════════════════════════════════════');
  
  // Check Google Client IDs
  const frontendPublicClientId = frontendEnv.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const frontendClientId = frontendEnv.GOOGLE_CLIENT_ID;
  const backendClientId = backendEnv.GOOGLE_CLIENT_ID;
  
  console.log(`Frontend NEXT_PUBLIC_GOOGLE_CLIENT_ID:`);
  console.log(`   ${frontendPublicClientId || '❌ Not set'}`);
  console.log(`Frontend GOOGLE_CLIENT_ID:`);
  console.log(`   ${frontendClientId || '❌ Not set'}`);
  console.log(`Backend GOOGLE_CLIENT_ID:`);
  console.log(`   ${backendClientId || '❌ Not set'}`);
  
  console.log('\n🔍 Consistency Check:');
  console.log('═══════════════════════');
  
  if (frontendPublicClientId === frontendClientId) {
    console.log('✅ Frontend Client IDs match');
  } else {
    console.log('❌ Frontend Client IDs do NOT match');
  }
  
  if (frontendClientId === backendClientId) {
    console.log('✅ Frontend-Backend Client IDs match');
  } else {
    console.log('❌ CRITICAL: Frontend-Backend Client IDs do NOT match');
    console.log('   This will cause Google token verification to fail');
  }
  
  if (frontendPublicClientId === backendClientId) {
    console.log('✅ All Client IDs are consistent');
  } else {
    console.log('❌ CRITICAL: Client ID inconsistency detected');
  }
  
  // Check Google Client Secret
  const frontendSecret = frontendEnv.GOOGLE_CLIENT_SECRET;
  const backendSecret = backendEnv.GOOGLE_CLIENT_SECRET;
  
  console.log('\n🔐 Google Client Secret Check:');
  console.log('═══════════════════════════════');
  console.log(`Frontend GOOGLE_CLIENT_SECRET: ${frontendSecret ? '✅ Set (' + frontendSecret.length + ' chars)' : '❌ Not set'}`);
  console.log(`Backend GOOGLE_CLIENT_SECRET: ${backendSecret ? '✅ Set (' + backendSecret.length + ' chars)' : '❌ Not set'}`);
  
  if (frontendSecret === backendSecret) {
    console.log('✅ Google Client Secrets match');
  } else {
    console.log('❌ Google Client Secrets do NOT match');
  }
  
  // Recommendations
  console.log('\n📋 Recommendations:');
  console.log('═══════════════════');
  
  if (frontendClientId !== backendClientId) {
    console.log('🔧 FIX REQUIRED: Update backend/.env with correct GOOGLE_CLIENT_ID');
    console.log(`   Current backend: ${backendClientId}`);
    console.log(`   Should be: ${frontendClientId}`);
  }
  
  if (!backendSecret) {
    console.log('🔧 FIX REQUIRED: Add GOOGLE_CLIENT_SECRET to backend/.env');
  }
  
  if (frontendClientId === backendClientId && backendSecret) {
    console.log('✅ Configuration looks correct');
    console.log('   The issue may be with:');
    console.log('   1. Google OAuth client configuration in Google Cloud Console');
    console.log('   2. Token format or timing issues');
    console.log('   3. Network connectivity to Google\'s verification endpoints');
  }
}

main();