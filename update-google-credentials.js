#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Update Google OAuth Credentials (After Fixing Client Type)\n');
console.log('This script will update your .env.local with new Web Application credentials.\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function updateCredentials() {
  try {
    console.log('📝 Enter your NEW Web Application credentials:\n');

    const googleClientId = await askQuestion('New Google Client ID: ');
    const googleClientSecret = await askQuestion('New Google Client Secret: ');

    if (!googleClientId || !googleClientSecret) {
      console.log('\n❌ Error: Both Client ID and Client Secret are required!');
      process.exit(1);
    }

    // Read current .env.local file
    const envPath = path.join(process.cwd(), '.env.local');
    
    if (!fs.existsSync(envPath)) {
      console.log('\n❌ Error: .env.local file not found!');
      process.exit(1);
    }

    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update Google OAuth credentials
    envContent = envContent.replace(
      /NEXT_PUBLIC_GOOGLE_CLIENT_ID=".*"/,
      `NEXT_PUBLIC_GOOGLE_CLIENT_ID="${googleClientId}"`
    );
    envContent = envContent.replace(
      /GOOGLE_CLIENT_ID=".*"/,
      `GOOGLE_CLIENT_ID="${googleClientId}"`
    );
    envContent = envContent.replace(
      /GOOGLE_CLIENT_SECRET=".*"/,
      `GOOGLE_CLIENT_SECRET="${googleClientSecret}"`
    );

    // Write updated content back to file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Environment variables updated successfully!');
    console.log('\n🔄 Next steps:');
    console.log('1. Restart your development servers');
    console.log('2. Test Google login at: http://localhost:3000/login');
    console.log('\n📋 Restart commands:');
    console.log('   Backend: cd backend && npm start');
    console.log('   Frontend: npm run dev');

  } catch (error) {
    console.error('\n❌ Error updating environment file:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

updateCredentials().catch(console.error);