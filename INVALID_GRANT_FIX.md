# 🚨 Google OAuth "invalid_grant" Fix Guide

## 🎯 Problem Identified
Your application code is **working correctly**! The 500 error occurs because Google is returning **invalid authorization codes** due to Google Cloud Console misconfiguration.

## 🔧 Immediate Fix Steps

### Step 1: Update Google Cloud Console Configuration

1. **Go to Google Cloud Console**: https://console.developers.google.com/apis/credentials
2. **Find your OAuth 2.0 Client ID**
3. **Click to edit it**
4. **Verify these EXACT settings**:

```
Application type: Web application
Name: Tribal Fashion OAuth Client

Authorized JavaScript origins:
http://localhost:3000

Authorized redirect URIs:
http://localhost:3000
```

⚠️ **CRITICAL**: Remove any other redirect URIs like:
- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3000/callback`
- Any other callback URLs

### Step 2: Clear Browser Cache

**Chrome/Edge**:
1. Press `Ctrl+Shift+Delete`
2. Select "Cookies and other site data"
3. Select "Cached images and files"
4. Click "Clear data"

**Firefox**:
1. Press `Ctrl+Shift+Delete`
2. Select "Cookies" and "Cache"
3. Click "Clear Now"

### Step 3: Test in Incognito Mode

1. **Open incognito/private browsing window**
2. **Go to**: http://localhost:3000/login  
3. **Try Google login**

## 🎯 Why This Happens

The `invalid_grant` error occurs when:
1. **Redirect URI mismatch**: Google Cloud Console redirect URIs don't match what `@react-oauth/google` expects
2. **Cached credentials**: Browser has cached old OAuth state
3. **Wrong application type**: Client configured as "Desktop" instead of "Web"

## 🔍 Verification Steps

After making changes:

1. **Wait 2-3 minutes** (Google needs time to update)
2. **Test in incognito mode first**
3. **Check browser console** for any new error messages
4. **Look for successful OAuth flow**

## 🚀 Expected Success Flow

After fixing, you should see:
1. **Google popup opens** when clicking "Continue with Google"
2. **Google consent screen appears** (allow permissions)
3. **Popup closes automatically**  
4. **User is authenticated and redirected**

## ⚡ Quick Alternative Fix

If above doesn't work, **create a completely new OAuth client**:

1. **Delete current OAuth client** in Google Cloud Console
2. **Create new one** with exact settings above
3. **Update `.env.local`** with new Client ID and Secret
4. **Update `backend/.env`** with same new Client ID and Secret
5. **Restart both servers**

## 📞 Still Not Working?

If you still get errors after this fix:
1. **Share the new error message** from browser console
2. **Confirm Google Cloud Console settings** match exactly
3. **Verify both servers restarted** after credential changes

The infrastructure is perfect - this is just a Google Cloud Console configuration issue!