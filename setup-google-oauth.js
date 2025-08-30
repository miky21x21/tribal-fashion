#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔧 Google OAuth Setup for Tribal Fashion\n');
console.log('This script will help you configure Google OAuth credentials.\n');

console.log('📋 STEP 1: Set up Google Cloud Console');
console.log('═══════════════════════════════════════\n');

console.log('1. Go to: https://console.developers.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable "Google Identity API" or "Google+ API"');
console.log('4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"');
console.log('5. Set application type to "Web application"');
console.log('6. Add authorized redirect URIs:');
console.log('   - http://localhost:3000/api/auth/callback/google (for development)');
console.log('   - Add your production domain when deploying');
console.log('7. Copy the Client ID and Client Secret\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function updateEnvFile() {
  try {
    console.log('📝 STEP 2: Configure Environment Variables');
    console.log('═════════════════════════════════════════\n');

    const googleClientId = await askQuestion('Enter your Google Client ID: ');
    const googleClientSecret = await askQuestion('Enter your Google Client Secret: ');

    if (!googleClientId || !googleClientSecret) {
      console.log('\n❌ Error: Both Client ID and Client Secret are required!');
      process.exit(1);
    }

    // Read current .env.local file
    const envPath = path.join(process.cwd(), '.env.local');
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
    console.log('\n🚀 STEP 3: Start the Application');
    console.log('═══════════════════════════════════════\n');
    console.log('1. Start the backend server:');
    console.log('   cd backend && npm start\n');
    console.log('2. Start the frontend (in a new terminal):');
    console.log('   npm run dev\n');
    console.log('3. Test Google login at: http://localhost:3000/login\n');
    console.log('📄 For troubleshooting, see: GOOGLE_OAUTH_SETUP.md\n');

  } catch (error) {
    console.error('\n❌ Error updating environment file:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Check if user wants to proceed with setup
async function main() {
  const proceed = await askQuestion('Have you completed Step 1 in Google Cloud Console? (y/N): ');
  
  if (proceed.toLowerCase() === 'y' || proceed.toLowerCase() === 'yes') {
    await updateEnvFile();
  } else {
    console.log('\n📖 Please complete Step 1 first, then run this script again.');
    console.log('For detailed instructions, see: GOOGLE_OAUTH_SETUP.md\n');
    rl.close();
  }
}

main().catch(console.error);