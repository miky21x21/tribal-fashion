# Google OAuth Setup Guide

This guide will help you fix the Google login issue by properly configuring Google OAuth credentials.

## What Was Fixed

1. **Created Missing API Route**: Added `/src/app/api/auth/google/route.ts` that was being called by the frontend but didn't exist.

2. **Fixed OAuth Flow**: The route now properly exchanges Google authorization codes for tokens and communicates with your backend.

3. **Improved Error Handling**: Added better error messages and validation.

4. **Updated Environment Variables**: Extended `.env.example` with all required variables.

## Setup Instructions

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** or **Google Identity API**
4. Go to **"Credentials"** → **"Create Credentials"** → **"OAuth 2.0 Client IDs"**
5. Set application type to **"Web application"**
6. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

### 2. Configure Environment Variables

1. Create a `.env.local` file in your project root:
```bash
cp .env.example .env.local
```

2. Update the Google OAuth variables in `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_actual_google_client_id"
GOOGLE_CLIENT_ID="your_actual_google_client_id"
GOOGLE_CLIENT_SECRET="your_actual_google_client_secret"
```

3. Set other required variables:
```env
NEXTAUTH_SECRET="generate_a_32_character_secret"
NEXTAUTH_URL="http://localhost:3000"
BACKEND_URL="http://localhost:5000"
```

### 3. Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use this Node.js one-liner:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Start the Application

1. Install dependencies:
```bash
npm install
cd backend && npm install
```

2. Start the backend server:
```bash
cd backend
npm start
```

3. Start the frontend (in a new terminal):
```bash
npm run dev
```

### 5. Test Google Login

1. Go to `http://localhost:3000/login`
2. Click "Continue with Google"
3. Complete the OAuth flow
4. You should be redirected back to your app with successful authentication

## Troubleshooting

### Common Issues:

1. **"Google authentication is not configured"**
   - Check that `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set in `.env.local`
   - Ensure the environment file is in the project root

2. **"Authorization code is required"**
   - The OAuth flow configuration might be incorrect
   - Check that redirect URIs match in Google Cloud Console

3. **"Failed to authenticate with Google"**
   - Backend might not be running on port 5000
   - Check backend logs for Google API errors
   - Verify `GOOGLE_CLIENT_SECRET` is correctly set

4. **"google-auth-library" import errors**
   - Run `npm install` to ensure dependencies are installed
   - This is already included in package.json

### Verification Steps:

1. Check backend is running: `curl http://localhost:5000/api/auth/oauth/google`
2. Check frontend is running: Open `http://localhost:3000/login`
3. Verify environment variables are loaded: Check browser console for error messages

## Security Notes

- Never commit `.env.local` to version control
- Use different credentials for development, staging, and production
- Regularly rotate your client secrets
- Restrict OAuth redirect URIs to your actual domains only

## Architecture

The authentication flow works as follows:

1. Frontend (`@react-oauth/google`) → Gets authorization code from Google
2. Frontend API route (`/api/auth/google`) → Exchanges code for tokens
3. Frontend API route → Calls backend OAuth endpoint with verified user data
4. Backend → Creates/updates user and returns JWT token
5. Frontend → Stores token and redirects user

This maintains separation between your frontend and backend while ensuring secure token exchange.