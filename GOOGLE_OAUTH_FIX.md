# 🔧 Fix: Google OAuth "NATIVE_DESKTOP" Client Type Error

## ❌ Error Details
```
Access blocked: Authorization Error
Storagerelay URI is not allowed for 'NATIVE_DESKTOP' client type.
Error 400: invalid_request
```

## 🎯 Root Cause
Your Google Cloud Console OAuth application is configured as a "Desktop application" instead of a "Web application". This causes the OAuth flow to fail because web-based authentication requires a different client type.

## ✅ Solution: Recreate OAuth Credentials as Web Application

### Step 1: Delete Current OAuth Credentials
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Select your project
3. Navigate to **"APIs & Services"** → **"Credentials"**
4. Find your current OAuth 2.0 Client ID
5. Click the **trash icon** to delete it

### Step 2: Create New Web Application Credentials
1. Click **"+ CREATE CREDENTIALS"**
2. Select **"OAuth 2.0 Client IDs"**
3. **IMPORTANT**: Choose **"Web application"** (NOT Desktop application)
4. Set **Name**: "Tribal Fashion Web Client"
5. **Authorized JavaScript origins**: Add these exactly:
   ```
   http://localhost:3000
   ```
6. **Authorized redirect URIs**: Add these exactly:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Click **"Create"**

### Step 3: Update Environment Variables
1. Copy the new **Client ID** and **Client Secret**
2. Update your `.env.local` file:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_new_client_id_here"
   GOOGLE_CLIENT_ID="your_new_client_id_here"
   GOOGLE_CLIENT_SECRET="your_new_client_secret_here"
   ```

### Step 4: Restart Application
```bash
# Stop current servers (Ctrl+C)
# Then restart:

# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

### Step 5: Test Again
1. Go to: http://localhost:3000/login
2. Click **"Continue with Google"**
3. Should now work without the desktop client error

## 🔍 Verification Checklist

- [ ] OAuth application type is "Web application"
- [ ] Authorized JavaScript origins: `http://localhost:3000`
- [ ] Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
- [ ] New credentials updated in `.env.local`
- [ ] Both servers restarted
- [ ] Google login tested successfully

## 🚨 Common Mistakes to Avoid

1. **Wrong Application Type**: Don't select "Desktop application" - must be "Web application"
2. **Missing Origins**: Ensure JavaScript origins includes `http://localhost:3000`
3. **Wrong Redirect URI**: Must be exactly `http://localhost:3000/api/auth/callback/google`
4. **Not Restarting**: Always restart servers after changing environment variables

## 🎯 Why This Happens

The error occurs because:
- **Desktop applications** use different OAuth flows (like PKCE) for native apps
- **Web applications** use authorization code flow with client secrets
- The `@react-oauth/google` library expects web application configuration
- Google's security policies don't allow certain URIs for desktop client types

## 📞 Still Having Issues?

If you still get errors after following these steps:

1. **Double-check client type**: Must be "Web application"
2. **Verify URIs exactly match**: No extra slashes or different protocols
3. **Clear browser cache**: OAuth errors can be cached
4. **Check browser console**: Look for additional error details
5. **Try incognito mode**: Eliminates browser extension interference

## ✅ Expected Result

After fixing, you should see:
1. Google OAuth popup opens
2. You can select your Google account
3. Permission screen appears
4. You're redirected back to your app authenticated
5. User profile data is available in your application

This fix addresses the core issue with OAuth client type configuration and should resolve the authorization error completely.