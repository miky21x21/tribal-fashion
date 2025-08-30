# 🚨 Google OAuth "invalid_request" Error Fix

## Problem Analysis
You're getting an "invalid_request" error when trying to exchange the Google authorization code for tokens. This is a common issue when using `@react-oauth/google` with the `auth-code` flow.

## Root Cause
The Google OAuth API route was missing the required `redirect_uri: 'postmessage'` parameter when calling `googleClient.getToken()`. When using popup-based OAuth flows, Google expects this specific redirect URI.

## ✅ FIXED
The issue has been resolved by updating `/src/app/api/auth/google/route.ts` to include the correct redirect URI parameter.

**What was changed:**
```typescript
// Before (BROKEN):
const { tokens } = await googleClient.getToken(code);

// After (FIXED):
const { tokens } = await googleClient.getToken({
  code: code,
  redirect_uri: 'postmessage'  // Required for @react-oauth/google popup flow
});
```

## Next Steps to Test the Fix

### 1. Ensure Both Servers Are Running

**Start Backend Server:**
```bash
cd backend
npm start
```
Should show: `Server running on port 5000`

**Start Frontend Server (in new terminal):**
```bash
cd ..
npm run dev
```
Should show: `Ready - started server on 0.0.0.0:3000`

### 2. Test Google Login
1. Open: http://localhost:3000/login
2. Click **"Continue with Google"**
3. Complete the OAuth flow in the popup
4. Should redirect back successfully without "invalid_request" error

### 3. Verify in Browser Console
Open Developer Tools (F12) and check for any errors:
- Should see successful OAuth flow completion
- No "invalid_request" errors in console
- Token exchange should work properly

## Why This Happened

When using `@react-oauth/google` with `flow: 'auth-code'`:
- The library uses a popup window for OAuth
- Google's OAuth popup flow requires `redirect_uri: 'postmessage'`
- Without this parameter, Google returns "invalid_request"
- This is different from traditional redirect-based OAuth flows

## Verification Commands

Run these to confirm everything is working:

```bash
# Check if environment variables are correct
npm run diagnose:google

# Verify no syntax errors in the fixed file
npx tsc --noEmit src/app/api/auth/google/route.ts
```

## Common Follow-up Issues

If you still see errors after this fix:

### ❌ "Backend connection failed"
- Ensure backend server is running on port 5000
- Check `BACKEND_URL="http://localhost:5000"` in `.env.local`

### ❌ "Network error" 
- Restart both frontend and backend servers
- Clear browser cache and cookies for localhost

### ❌ "Token verification failed"
- Verify your Google Client ID is correct in `.env.local`
- Check that the OAuth client exists in Google Cloud Console

## Google Cloud Console Configuration

Your current setup should work with these settings:
- **Application type**: Web application
- **Authorized JavaScript origins**: `http://localhost:3000`
- **Authorized redirect URIs**: `http://localhost:3000`

**Note**: No need for `/api/auth/callback/google` in redirect URIs when using popup flow.

## Prevention for Future

To avoid this issue:
1. Always use `redirect_uri: 'postmessage'` with `@react-oauth/google` popup flows
2. Test OAuth flows after any changes to the authentication setup
3. Keep the Google OAuth client configuration documentation handy
4. Use the diagnostic tools to verify configuration before testing

The fix ensures compatibility with Google's popup-based OAuth flow requirements!