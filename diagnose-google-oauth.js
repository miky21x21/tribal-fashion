#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Google OAuth Credential Diagnostic Tool\n');
console.log('═══════════════════════════════════════════\n');

// Read environment variables
const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  console.log('❌ Error: .env.local file not found!');
  console.log('📝 Create .env.local file first with your Google OAuth credentials.\n');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

let frontendClientId = '';
let backendClientId = '';
let clientSecret = '';

// Parse environment variables
envLines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_GOOGLE_CLIENT_ID=')) {
    frontendClientId = line.split('=')[1]?.replace(/"/g, '').trim() || '';
  }
  if (line.startsWith('GOOGLE_CLIENT_ID=')) {
    backendClientId = line.split('=')[1]?.replace(/"/g, '').trim() || '';
  }
  if (line.startsWith('GOOGLE_CLIENT_SECRET=')) {
    clientSecret = line.split('=')[1]?.replace(/"/g, '').trim() || '';
  }
});

console.log('📊 Current Credential Analysis:');
console.log('═════════════════════════════════\n');

console.log(`Frontend Client ID: ${frontendClientId}`);
console.log(`Backend Client ID:  ${backendClientId}`);
console.log(`Client Secret:      ${clientSecret ? '***' + clientSecret.slice(-4) : 'NOT SET'}\n`);

// Check for issues
let hasIssues = false;

if (!frontendClientId || frontendClientId === 'YOUR_GOOGLE_CLIENT_ID') {
  console.log('❌ Issue: Frontend Client ID not configured');
  hasIssues = true;
}

if (!backendClientId || backendClientId === 'YOUR_GOOGLE_CLIENT_ID') {
  console.log('❌ Issue: Backend Client ID not configured');
  hasIssues = true;
}

if (!clientSecret || clientSecret === 'YOUR_GOOGLE_CLIENT_SECRET') {
  console.log('❌ Issue: Client Secret not configured');
  hasIssues = true;
}

if (frontendClientId && backendClientId && frontendClientId !== backendClientId) {
  console.log('❌ CRITICAL Issue: Frontend and Backend Client IDs are DIFFERENT!');
  console.log('   This is the likely cause of your "deleted_client" error.');
  console.log('   Both should be identical for proper OAuth flow.\n');
  hasIssues = true;
}

if (frontendClientId === backendClientId && frontendClientId) {
  console.log('✅ Good: Frontend and Backend Client IDs match');
}

// Check Client ID format
const clientIdPattern = /^\d+-[a-zA-Z0-9]+\.apps\.googleusercontent\.com$/;

if (frontendClientId && !clientIdPattern.test(frontendClientId)) {
  console.log('⚠️  Warning: Frontend Client ID format seems invalid');
  hasIssues = true;
}

if (backendClientId && !clientIdPattern.test(backendClientId)) {
  console.log('⚠️  Warning: Backend Client ID format seems invalid');
  hasIssues = true;
}

console.log('\n🎯 "deleted_client" Error Analysis:');
console.log('═════════════════════════════════════════\n');

if (frontendClientId !== backendClientId) {
  console.log('🔍 Root Cause: MISMATCHED CLIENT IDs');
  console.log('   Your frontend and backend are using different OAuth clients.');
  console.log('   One or both of these clients may have been deleted.\n');
  
  console.log('🛠️  Fix Required:');
  console.log('   1. Go to Google Cloud Console');
  console.log('   2. Check which client IDs still exist');
  console.log('   3. Create NEW OAuth client if needed');
  console.log('   4. Update BOTH variables to use SAME client ID\n');
} else if (!frontendClientId) {
  console.log('🔍 Root Cause: MISSING CLIENT ID');
  console.log('   No Google Client ID configured in environment.\n');
} else {
  console.log('🔍 Possible Cause: CLIENT DELETED IN GOOGLE CONSOLE');
  console.log('   Your Client IDs match, but the client may be deleted/deactivated.');
  console.log('   Check Google Cloud Console to verify client status.\n');
}

console.log('📋 Next Steps:');
console.log('══════════════\n');

if (hasIssues) {
  console.log('1. 🌐 Open Google Cloud Console:');
  console.log('   https://console.developers.google.com/');
  console.log('2. 🔧 Go to: APIs & Services → Credentials');
  console.log('3. 👀 Check if your OAuth clients exist');
  console.log('4. ➕ Create new OAuth 2.0 Client ID if needed');
  console.log('5. 📝 Update .env.local with new credentials');
  console.log('6. 🔄 Restart both frontend and backend servers\n');
  
  console.log('📖 For detailed instructions, see:');
  console.log('   - DELETED_CLIENT_FIX.md (comprehensive guide)');
  console.log('   - SETUP_GUIDE.md (step-by-step setup)\n');
} else {
  console.log('✅ Configuration looks correct!');
  console.log('   If still getting "deleted_client" error:');
  console.log('   1. Verify client exists in Google Cloud Console');
  console.log('   2. Check you\'re in the correct Google Cloud project');
  console.log('   3. Restart development servers');
  console.log('   4. Try authentication in incognito mode\n');
}

console.log('🔧 Quick Fix Command:');
console.log('══════════════════════\n');
console.log('node setup-google-oauth.js  # Interactive setup wizard\n');

if (hasIssues) {
  process.exit(1);
} else {
  process.exit(0);
}