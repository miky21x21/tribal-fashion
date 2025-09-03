#!/usr/bin/env node

/**
 * Quick test environment setup for OAuth
 * This creates a minimal .env.local for testing OAuth flow
 */

const fs = require('fs');
const path = require('path');

const envContent = `# NextAuth Configuration (Required)
NEXTAUTH_SECRET="0OUBPLpYuOqNDeN3iIoH5RnNkU737iAKIHdu7taCVB8="
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Required for Google Sign-In)
GOOGLE_CLIENT_ID="750638286490-6827m3k46egnho2mp7774ms2n63841c2.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"

# Apple Sign In (Required for Apple Sign-In)
APPLE_ID="your-apple-service-id"
APPLE_SECRET="your-apple-private-key"

# Database (Optional for now - using JWT strategy)
# DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Backend API (Optional for now)
# BACKEND_URL="http://localhost:5000"
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists');
    console.log('');
    console.log('📝 To test OAuth, make sure you have:');
    console.log('1. GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET set');
    console.log('2. APPLE_ID and APPLE_SECRET set');
    console.log('');
    console.log('🔐 Your NextAuth secret is already set!');
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local created for OAuth testing!');
    console.log('');
    console.log('🚀 Next steps to test OAuth:');
    console.log('1. Get Google OAuth credentials from Google Cloud Console');
    console.log('2. Get Apple Sign-In credentials from Apple Developer Console');
    console.log('3. Update the .env.local file with your credentials');
    console.log('4. Run: npm run dev');
    console.log('5. Test at: http://localhost:3000/login');
    console.log('');
    console.log('💡 Note: Database setup is optional for now - using JWT strategy');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
