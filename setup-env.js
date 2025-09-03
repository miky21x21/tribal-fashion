#!/usr/bin/env node

/**
 * Setup environment variables for OAuth authentication
 * This script creates a .env.local file with the required variables
 */

const fs = require('fs');
const path = require('path');

const envContent = `# NextAuth Configuration
NEXTAUTH_SECRET="0OUBPLpYuOqNDeN3iIoH5RnNkU737iAKIHdu7taCVB8="
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Apple Sign In
APPLE_ID="your-apple-service-id"
APPLE_SECRET="your-apple-private-key"

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Backend API
BACKEND_URL="http://localhost:5000"
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Please update it manually with the values below:');
    console.log('');
    console.log(envContent);
  } else {
    // Create .env.local file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local file created successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('1. Update GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET with your Google OAuth credentials');
    console.log('2. Update APPLE_ID and APPLE_SECRET with your Apple Sign-In credentials');
    console.log('3. Update DATABASE_URL with your database connection string');
    console.log('');
    console.log('🔐 Your NextAuth secret is already set and secure!');
  }
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  console.log('');
  console.log('📝 Please create .env.local manually with this content:');
  console.log('');
  console.log(envContent);
}
