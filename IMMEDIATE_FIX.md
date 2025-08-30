# 🚨 IMMEDIATE FIX: Redirect URI Mismatch

## The Problem
You're getting `Error 400: redirect_uri_mismatch` because Google Cloud Console is configured incorrectly.

## 🔧 **Fix This Right Now (2 minutes):**

### **Step 1: Open Google Cloud Console**
1. Go to: https://console.developers.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID for this project
3. Click on it to edit

### **Step 2: Fix the Redirect URIs**
Look for the **"Authorized redirect URIs"** section.

**❌ REMOVE these if they exist:**
- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3000/callback`
- Any other callback URLs

**✅ ADD this exact URL:**
```
http://localhost:3000
```
(Yes, just the base URL - no /callback, no /api, nothing extra)

### **Step 3: Verify JavaScript Origins**
In **"Authorized JavaScript origins"** section, make sure you have:
```
http://localhost:3000
```

### **Step 4: Save**
Click **"Save"** at the bottom

### **Step 5: Test Immediately**
- Go to: http://localhost:3000/login
- Click "Continue with Google"
- Should work now!

## 🎯 **Why This Works**

The `@react-oauth/google` library:
- Uses popup authentication (not page redirects)
- Only needs the base URL to be authorized
- Handles OAuth internally
- Doesn't use traditional callback endpoints

## 📱 **Visual Guide**

Your Google Cloud Console should look like this:

```
Application type: Web application
Name: [Your app name]

Authorized JavaScript origins:
✅ http://localhost:3000

Authorized redirect URIs:
✅ http://localhost:3000
❌ NOT: http://localhost:3000/api/auth/callback/google
❌ NOT: http://localhost:3000/callback
```

## 🔄 **If Still Not Working**

1. **Wait 1-2 minutes** after saving (Google needs time to propagate changes)
2. **Clear browser cache** or try incognito mode
3. **Check browser console** for any additional errors
4. **Verify both servers are running**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🎉 **Expected Result**

After this fix:
1. Click "Continue with Google"
2. Small popup window opens (not a redirect)
3. Select your Google account
4. Popup closes automatically
5. You're logged in!

**This should resolve the redirect_uri_mismatch error immediately.**