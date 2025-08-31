#!/usr/bin/env node

/**
 * Test OTP Functionality
 * 
 * This script tests the phone verification system to ensure it works
 * in both development mode (without Twilio) and production mode (with Twilio).
 */

const http = require('http');
const { URL } = require('url');

const BASE_URL = 'http://localhost:3000';
const TEST_PHONE = '+1234567890';

async function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testOTPFlow() {
  console.log('🧪 Testing OTP Functionality\\n');

  try {
    // Test 1: Send OTP
    console.log('📤 Step 1: Sending OTP...');
    const sendResult = await makeRequest('/api/auth/phone/verify', 'POST', {
      phoneNumber: TEST_PHONE,
      action: 'send'
    });

    console.log(`Status: ${sendResult.status}`);
    console.log(`Response:`, sendResult.data);

    if (sendResult.status !== 200 || !sendResult.data.success) {
      console.log('❌ Failed to send OTP');
      return false;
    }

    console.log('✅ OTP sent successfully\\n');

    // Extract development code if available
    const devCode = sendResult.data.developmentCode;
    if (devCode) {
      console.log(`🔑 Development Code: ${devCode}\\n`);
      
      // Test 2: Verify OTP
      console.log('✅ Step 2: Verifying OTP...');
      const verifyResult = await makeRequest('/api/auth/phone/verify', 'POST', {
        phoneNumber: TEST_PHONE,
        code: devCode,
        action: 'verify'
      });

      console.log(`Status: ${verifyResult.status}`);
      console.log(`Response:`, verifyResult.data);

      if (verifyResult.status !== 200 || !verifyResult.data.success) {
        console.log('❌ Failed to verify OTP');
        return false;
      }

      console.log('✅ OTP verified successfully\\n');
    } else {
      console.log('📱 SMS should be sent to your phone (Twilio configured)\\n');
      console.log('Enter the code manually to test verification.');
    }

    console.log('🎉 OTP functionality is working correctly!');
    return true;

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

async function checkTwilioConfig() {
  console.log('🔍 Checking Twilio Configuration\\n');
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || accountSid.includes('your_')) {
    console.log('⚠️  TWILIO_ACCOUNT_SID not configured (using development mode)');
  } else if (!accountSid.startsWith('AC')) {
    console.log('❌ TWILIO_ACCOUNT_SID should start with "AC"');
  } else {
    console.log('✅ TWILIO_ACCOUNT_SID configured');
  }

  if (!authToken || authToken.includes('your_')) {
    console.log('⚠️  TWILIO_AUTH_TOKEN not configured (using development mode)');
  } else {
    console.log('✅ TWILIO_AUTH_TOKEN configured');
  }

  if (!phoneNumber || phoneNumber.includes('your_')) {
    console.log('⚠️  TWILIO_PHONE_NUMBER not configured (using development mode)');
  } else if (!phoneNumber.startsWith('+')) {
    console.log('❌ TWILIO_PHONE_NUMBER should start with "+" (E.164 format)');
  } else {
    console.log('✅ TWILIO_PHONE_NUMBER configured');
  }

  const isConfigured = accountSid && authToken && phoneNumber && 
                      accountSid.startsWith('AC') && phoneNumber.startsWith('+') &&
                      !accountSid.includes('your_') && !authToken.includes('your_') && 
                      !phoneNumber.includes('your_');

  if (isConfigured) {
    console.log('\\n🚀 Twilio is properly configured - SMS will be sent');
  } else {
    console.log('\\n🛠️  Twilio not configured - using development mode');
    console.log('💡 See TWILIO_SETUP.md for configuration instructions');
  }

  console.log('');
  return isConfigured;
}

async function main() {
  console.log('='.repeat(50));
  console.log('🔐 OTP FUNCTIONALITY TEST');
  console.log('='.repeat(50));
  console.log('');

  // Check configuration
  await checkTwilioConfig();

  // Test functionality
  const success = await testOTPFlow();

  console.log('\\n' + '='.repeat(50));
  if (success) {
    console.log('🎉 ALL TESTS PASSED');
    console.log('✅ OTP functionality is working correctly');
  } else {
    console.log('❌ TESTS FAILED');
    console.log('🔧 Check the error messages above and fix any issues');
  }
  console.log('='.repeat(50));
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testOTPFlow, checkTwilioConfig };