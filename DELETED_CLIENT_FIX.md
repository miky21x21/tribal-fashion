# 🚨 Google OAuth "deleted_client" Error Fix Guide

## Problem Analysis
You're getting a "deleted_client" error, which means the OAuth client ID in your `.env.local` file corresponds to a client that has been deleted or deactivated in Google Cloud Console.

**Current Issue**: Your environment file has TWO different Google Client IDs:
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID="196192626861-e3ks11j8uj6bg5ikahkhvhtk2sls7v9l.apps.googleusercontent.com"`
- `GOOGLE_CLIENT_ID="196192626861-o84l2l6banerluf5msub34g3m0n7jgaf.apps.googleusercontent.com"`

This inconsistency suggests one or both clients have been deleted.

## Immediate Fix Steps

### Step 1: Verify Google Cloud Console Status
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Select your project (or create a new one if needed)
3. Navigate to **"APIs & Services"** → **"Credentials"**
4. Check if you see any OAuth 2.0 Client IDs listed
5. Look for the client IDs from your `.env.local` file

**Expected Results**:
- ✅ **If clients exist**: You'll see them listed with names like "Web client" or similar
- ❌ **If clients deleted**: You'll see empty credentials section or different client IDs

### Step 2: Create New OAuth Credentials (If Needed)

#### 2.1 Enable Required API (if not already enabled)
- Go to **"APIs & Services"** → **"Library"**
- Search for **"Google Identity"** 
- Click **"Enable"** if not already enabled

#### 2.2 Create New OAuth 2.0 Client
- Go to **"APIs & Services"** → **"Credentials"**
- Click **"+ CREATE CREDENTIALS"** → **"OAuth 2.0 Client IDs"**
- **Application type**: **Web application** ⚠️ **CRITICAL**
- **Name**: "Tribal Fashion OAuth Client"
- **Authorized JavaScript origins**:
  ```
  http://localhost:3000
  ```
- **Authorized redirect URIs**:
  ```
  http://localhost:3000
  ```
  ⚠️ **Important**: Use base URL only, NOT `/api/auth/callback/google`
- Click **"Create"**
- **COPY** both Client ID and Client Secret

### Step 3: Update Environment Variables

Replace the inconsistent credentials in `.env.local`:

```env
# Use the SAME Client ID for both variables
NEXT_PUBLIC_GOOGLE_CLIENT_ID="YOUR_NEW_CLIENT_ID_HERE"
GOOGLE_CLIENT_ID="YOUR_NEW_CLIENT_ID_HERE"
GOOGLE_CLIENT_SECRET="YOUR_NEW_CLIENT_SECRET_HERE"
```

⚠️ **Critical**: Both `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_ID` MUST be identical!

### Step 4: Restart Development Servers

```bash
# Stop both servers (Ctrl+C)
# Then restart backend
cd backend
npm start

# In new terminal, restart frontend
cd ..
npm run dev
```

### Step 5: Test the Fix

1. Open http://localhost:3000/login
2. Click **"Continue with Google"**
3. Should see Google OAuth consent screen (not error)
4. Complete authentication flow
5. Should redirect back successfully

## Verification Commands

Run these to verify your setup:

```bash
# Check if environment variables are loaded
node -e "require('dotenv').config({path:'.env.local'}); console.log('Frontend Client ID:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID); console.log('Backend Client ID:', process.env.GOOGLE_CLIENT_ID); console.log('Match:', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === process.env.GOOGLE_CLIENT_ID);"
```

## Common Causes of Client Deletion

1. **Multiple OAuth attempts**: Creating and deleting clients multiple times
2. **Project cleanup**: Accidentally deleting credentials during console cleanup
3. **Quota limits**: Google Cloud projects hitting OAuth client limits
4. **Project switching**: Working in wrong Google Cloud project

## Prevention Tips

- **Document your credentials**: Save Client ID/Secret in secure password manager
- **Use consistent naming**: Name OAuth clients clearly (e.g., "Tribal Fashion - Development")
- **Single client per environment**: Don't create multiple clients for same environment
- **Backup configurations**: Keep screenshots of Google Cloud Console settings

## If This Happens Again

1. Check Google Cloud Console audit logs (**IAM & Admin** → **Audit Logs**)
2. Verify you're in correct Google Cloud project
3. Check project quotas and limits
4. Consider using a dedicated Google account for development projects

## Need Help?

If you're still getting errors after following this guide:
1. Verify the new Client ID appears in Google Cloud Console
2. Check browser developer console for specific error messages
3. Ensure both backend and frontend servers restarted
4. Try authentication in incognito/private browser mode