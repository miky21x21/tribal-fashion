# Environment Setup Guide

This guide explains how to configure all required environment variables for the Tribal Fashion e-commerce platform.

## Quick Start

1. **Copy environment files:**
```bash
cp .env.local.example .env.local
```

2. **Update the placeholder values in `.env.local` with your actual credentials.**

## Authentication Providers Configuration

### Google OAuth

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API or Google Identity API
4. Create OAuth 2.0 credentials (Client ID and Client Secret)
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`

### Apple Sign In

1. Go to [Apple Developer Console](https://developer.apple.com/account/resources/identifiers/list)
2. Create an App ID with Sign In with Apple capability enabled
3. Create a Services ID (this becomes your Client ID)
4. Generate a private key and create the client secret JWT
5. Update `APPLE_CLIENT_ID` and `APPLE_CLIENT_SECRET` in `.env.local`

**Note:** Apple client secret is a JWT that you need to generate using your private key. This is more complex than other providers.

### Twilio SMS Service

1. Go to [Twilio Console](https://console.twilio.com/)
2. Get your Account SID and Auth Token from the dashboard
3. Purchase a phone number or use your existing Twilio number
4. Update `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` in `.env.local`
5. **Important:** Ensure phone number is in E.164 format (e.g., +1234567890)

### NextAuth Secret

Generate a secure secret for NextAuth:
```bash
openssl rand -base64 32
```
Update `NEXTAUTH_SECRET` in `.env.local` with the generated value.

## Environment Variables Reference

### Authentication Variables
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret  
- `APPLE_CLIENT_ID` - Apple Services ID
- `APPLE_CLIENT_SECRET` - Apple client secret (JWT)
- `NEXTAUTH_SECRET` - Secret for NextAuth encryption (32+ characters)
- `NEXTAUTH_URL` - Base URL for NextAuth (http://localhost:3000 for dev)

### Twilio Variables
- `TWILIO_ACCOUNT_SID` - Twilio account identifier
- `TWILIO_AUTH_TOKEN` - Twilio authentication token
- `TWILIO_PHONE_NUMBER` - Twilio phone number in E.164 format (+1234567890)

### Backend Configuration
- `BACKEND_URL` - Backend API URL (http://localhost:5000 for dev)

## Validation

The application automatically validates environment variables on startup. If any required variables are missing or contain placeholder values, you'll see warnings or errors in the console.

You can also manually validate your environment configuration by importing and using the validation utilities:

```typescript
import { env, authConfig, twilioConfig } from '@/utils/env';

// This will throw an error if any required variables are missing
console.log('Environment validated successfully');
```

## Security Notes

1. **Never commit `.env.local`** to version control
2. **Use strong, unique secrets** for production environments
3. **Rotate secrets regularly** in production
4. **Use different credentials** for development, staging, and production
5. **Restrict OAuth redirect URIs** to your actual domains

## Troubleshooting

### Common Issues

1. **"Missing required environment variables" error**
   - Check that all variables are set in `.env.local`
   - Ensure no typos in variable names

2. **"Placeholder value detected" warnings**
   - Replace placeholder values (containing `your_` or `_here`) with real credentials

3. **Twilio phone number format warnings**
   - Ensure phone number starts with `+` and country code
   - Example: `+1234567890` for US numbers

4. **NextAuth secret length warnings**
   - Use a secret of at least 32 characters
   - Generate with: `openssl rand -base64 32`

### Testing Configuration

To test your configuration without running the full application:

```bash
node -e "require('./src/utils/env.ts')"
```

This will validate all environment variables and show any issues.