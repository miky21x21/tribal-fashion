#!/usr/bin/env node

console.log('🧪 Google OAuth Configuration Verifier\n');

function checkConfiguration() {
  console.log('📋 Configuration Checklist:\n');
  
  const checks = [
    {
      name: 'Google Cloud Console - Application Type',
      check: 'Web Application (NOT Desktop)',
      status: '⚠️ Manual Check Required'
    },
    {
      name: 'Authorized JavaScript Origins',
      check: 'http://localhost:3000',
      status: '⚠️ Manual Check Required'
    },
    {
      name: 'Authorized Redirect URIs',
      check: 'http://localhost:3000 (base URL only)',
      status: '⚠️ Manual Check Required'
    },
    {
      name: 'Frontend Code Configuration',
      check: 'useGoogleLogin without redirect_uri parameter',
      status: '✅ Fixed in code'
    }
  ];

  checks.forEach(item => {
    console.log(`${item.status} ${item.name}`);
    console.log(`   Expected: ${item.check}\n`);
  });

  console.log('🔧 Manual Steps to Complete:\n');
  console.log('1. Go to: https://console.developers.google.com/apis/credentials');
  console.log('2. Click on your OAuth 2.0 Client ID');
  console.log('3. Verify/Update configuration:');
  console.log('   - Application type: Web application');
  console.log('   - Authorized JavaScript origins: http://localhost:3000');
  console.log('   - Authorized redirect URIs: http://localhost:3000');
  console.log('4. Click "Save"');
  console.log('5. Test Google login at: http://localhost:3000/login\n');

  console.log('🎯 Expected OAuth Flow:\n');
  console.log('1. Click "Continue with Google"');
  console.log('2. Google popup opens (not redirect)');
  console.log('3. Select Google account');
  console.log('4. Grant permissions');
  console.log('5. Popup closes automatically');
  console.log('6. User authenticated in main window\n');

  console.log('🚨 Common Issues to Avoid:\n');
  console.log('❌ DO NOT use: http://localhost:3000/api/auth/callback/google');
  console.log('❌ DO NOT select: Desktop application type');
  console.log('❌ DO NOT forget: to save changes in Google Cloud Console');
  console.log('✅ DO use: http://localhost:3000 (base URL only)');
  console.log('✅ DO select: Web application type');
  console.log('✅ DO test: in incognito mode if issues persist\n');

  console.log('📞 Still having issues?');
  console.log('- Check browser console for detailed errors');
  console.log('- Try clearing browser cache');
  console.log('- Verify both servers are running (frontend:3000, backend:5000)');
  console.log('- See REDIRECT_URI_FIX.md for detailed troubleshooting');
}

checkConfiguration();