# Twilio SMS Authentication Setup Guide

The phone verification feature requires Twilio SMS service. Follow this guide to set it up.

## Current Status: Development Mode

**The app is currently running in development mode** where:
- ✅ OTP codes are generated and logged to console
- ✅ Phone verification works without Twilio
- ✅ Development codes are displayed in success messages
- 📱 No actual SMS is sent

## Quick Test (Development Mode)

1. Go to profile page and click "Update" next to phone number
2. Enter any valid phone number (e.g., +1234567890)
3. Click "Send OTP"
4. Check the browser console or success message for the OTP code
5. Enter the code and click "Verify OTP"

## Setup Twilio for Production SMS

### Step 1: Create Twilio Account

1. Go to [Twilio Console](https://console.twilio.com/)
2. Sign up for a free account
3. Verify your email and phone number

### Step 2: Get Your Credentials

1. From the Twilio Console Dashboard, copy:
   - **Account SID** (starts with "AC...")
   - **Auth Token** (click to reveal)

### Step 3: Get a Phone Number

1. Go to Phone Numbers → Manage → Buy a number
2. Choose a number with SMS capability
3. Purchase the number (uses trial credits or billing)
4. Copy the phone number in E.164 format (e.g., +1234567890)

### Step 4: Update Environment Variables

Update your `.env.local` file:

```bash
# Replace with your actual Twilio credentials
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Step 5: Restart the Application

```bash
npm run dev
```

## Verification

Once configured, the app will:
- ✅ Send actual SMS messages
- ✅ Show "Verification code sent successfully" 
- ✅ No development codes in console

## Troubleshooting

### "SMS service not configured"
- Check that TWILIO_ACCOUNT_SID starts with "AC"
- Ensure no placeholder values (no "your_" text)
- Restart the development server

### "Failed to send SMS"
- Verify phone number is in E.164 format (+1234567890)
- Check Twilio account has sufficient balance/credits
- Ensure the "From" number is verified in Twilio

### SMS Not Received
- Check phone number formatting
- Verify the recipient number is verified (trial accounts)
- Check Twilio logs in the console for delivery status

## Security Notes

1. **Never commit** actual Twilio credentials to version control
2. **Use different credentials** for development, staging, and production
3. **Monitor usage** to prevent unauthorized use
4. **Set up webhooks** for delivery status in production

## Cost Information

- **Trial Account**: $15.50 in free credits
- **SMS Cost**: ~$0.0075 per message in the US
- **Phone Number**: ~$1.15/month

## Alternative Approaches

For development/testing without Twilio:
- Use the current development mode (codes in console)
- Implement email-based verification instead
- Use test phone numbers with fixed OTP codes

---

**Note**: The current implementation gracefully falls back to development mode when Twilio is not configured, making it easy to develop and test without SMS charges.