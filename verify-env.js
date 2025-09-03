#!/usr/bin/env node

/**
 * Verify environment variables for OAuth
 * This script checks if all required variables are set correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying OAuth Environment Variables...\n');

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📝 Create it with the required variables.');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

console.log('📋 Environment Variables Status:\n');

const requiredVars = {
  'NEXTAUTH_SECRET': 'NextAuth encryption secret',
  'NEXTAUTH_URL': 'Base URL for NextAuth',
  'GOOGLE_CLIENT_ID': 'Google OAuth Client ID',
  'GOOGLE_CLIENT_SECRET': 'Google OAuth Client Secret',
  'APPLE_ID': 'Apple Sign-In Service ID',
  'APPLE_SECRET': 'Apple Sign-In Private Key'
};

let allGood = true;

for (const [varName, description] of Object.entries(requiredVars)) {
  const line = lines.find(line => line.startsWith(varName + '='));
  
  if (!line) {
    console.log(`❌ ${varName}: Missing`);
    console.log(`   Description: ${description}`);
    allGood = false;
  } else {
    const value = line.split('=')[1]?.replace(/"/g, '').trim();
    if (!value || value === 'your-google-client-id.apps.googleusercontent.com' || value.includes('your-')) {
      console.log(`⚠️  ${varName}: Set but needs real value`);
      console.log(`   Current: ${value}`);
      console.log(`   Description: ${description}`);
      allGood = false;
    } else {
      console.log(`✅ ${varName}: Set correctly`);
      if (varName.includes('SECRET') || varName.includes('SECRET')) {
        console.log(`   Value: ${value.substring(0, 10)}...${value.substring(value.length - 5)}`);
      } else {
        console.log(`   Value: ${value}`);
      }
    }
  }
  console.log('');
}

if (allGood) {
  console.log('🎉 All environment variables are set correctly!');
  console.log('');
  console.log('🚀 Next steps:');
  console.log('1. Make sure Google OAuth redirect URI is set to:');
  console.log('   http://localhost:3000/api/auth/callback/google');
  console.log('2. Test at: http://localhost:3000/debug-oauth');
} else {
  console.log('⚠️  Some environment variables need attention.');
  console.log('');
  console.log('🔧 Fix the issues above, then test again.');
  console.log('📖 See: http://localhost:3000/debug-oauth for detailed help');
}
