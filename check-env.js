#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Environment Configuration Checker\n');

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  const requiredVars = [
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_ID', 
    'GOOGLE_CLIENT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'BACKEND_URL'
  ];

  const results = {};
  
  for (const line of lines) {
    if (line.includes('=')) {
      const [key, value] = line.split('=');
      const cleanKey = key.trim();
      const cleanValue = value?.replace(/"/g, '').trim();
      
      if (requiredVars.includes(cleanKey)) {
        results[cleanKey] = {
          configured: !!cleanValue && !cleanValue.includes('your_') && !cleanValue.includes('_here'),
          value: cleanValue
        };
      }
    }
  }

  console.log('📋 Configuration Status:\n');
  
  let allConfigured = true;
  
  for (const varName of requiredVars) {
    const status = results[varName];
    if (status) {
      const icon = status.configured ? '✅' : '❌';
      const statusText = status.configured ? 'Configured' : 'Needs setup';
      console.log(`${icon} ${varName}: ${statusText}`);
      if (!status.configured) {
        allConfigured = false;
      }
    } else {
      console.log(`❌ ${varName}: Missing`);
      allConfigured = false;
    }
  }

  console.log('\n' + '='.repeat(50));
  
  if (allConfigured) {
    console.log('🎉 All required environment variables are configured!');
    console.log('\n🚀 Ready to start the application:');
    console.log('   1. cd backend && npm start');
    console.log('   2. npm run dev (in new terminal)');
    console.log('   3. Test at: http://localhost:3000/login');
  } else {
    console.log('⚠️  Some environment variables need configuration.');
    console.log('\n📖 Next steps:');
    console.log('   1. Run: node setup-google-oauth.js');
    console.log('   2. Or manually update .env.local');
    console.log('   3. See SETUP_GUIDE.md for detailed instructions');
  }
  
  return allConfigured;
}

checkEnvFile();