# 🔧 Fix: Google OAuth "redirect_uri_mismatch" Error

## ❌ Error Details
```
Access blocked: This app's request is invalid
Error 400: redirect_uri_mismatch
```

## 🎯 Root Cause
The redirect URI configured in Google Cloud Console doesn't match what your application is sending. This happens because `@react-oauth/google` with `auth-code` flow doesn't use traditional redirect URIs.

## ✅ Quick Fix (2 minutes)

### Step 1: Update Google Cloud Console
1. Go to [Google Cloud Console Credentials](https://console.developers.google.com/apis/credentials)
2. Click on your OAuth 2.0 Client ID
3. In **"Authorized redirect URIs"** section:
   - **Remove**: `http://localhost:3000/api/auth/callback/google`
   - **Add**: `http://localhost:3000` (just the base URL)
4. Click **"Save"**

### Step 2: Test Again
- No need to update environment variables
- No need to restart servers
- Just try Google login again: http://localhost:3000/login

## 🎯 Why This Works

The `@react-oauth/google` library with `auth-code` flow:
- Uses popup-based authentication
- Doesn't require traditional redirect URIs
- Only needs the base origin URL to be authorized
- Handles the OAuth flow internally

## 📋 Final Google Cloud Console Configuration

**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000
```

## 🔍 Alternative Fix (If Above Doesn't Work)

If you still get redirect URI errors, try adding both:

**Authorized redirect URIs:**
```
http://localhost:3000
http://localhost:3000/
```

## ✅ Expected Result

After this fix:
1. Click "Continue with Google" 
2. Google OAuth popup opens
3. You select your account
4. Popup closes and you're authenticated
5. No more redirect URI errors

## 🚨 For Production

When deploying to production, add your production domain:

**Authorized JavaScript origins:**
```
http://localhost:3000
https://yourdomain.com
```

**Authorized redirect URIs:**
```
http://localhost:3000
https://yourdomain.com
```

This fix resolves the redirect URI mismatch by aligning Google Cloud Console configuration with how the OAuth library actually works.