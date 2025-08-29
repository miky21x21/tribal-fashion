# 🔧 Google OAuth Setup - Step by Step Guide

## Current Status
✅ **Google OAuth API route created** (`/src/app/api/auth/google/route.ts`)  
✅ **Environment template ready** (`.env.local` with NextAuth secret)  
✅ **Frontend integration fixed** (login page updated)  

## What You Need to Do

### Step 1: Google Cloud Console Setup

#### 1.1 Access Google Cloud Console
- Open: [Google Cloud Console](https://console.developers.google.com/)
- Sign in with your Google account

#### 1.2 Create/Select Project
- **Option A**: Create new project
  - Click "New Project"
  - Name: "Tribal Fashion Auth" (or your preferred name)
  - Click "Create"
- **Option B**: Select existing project from dropdown

#### 1.3 Enable Required APIs
- Go to **"APIs & Services"** → **"Library"**
- Search for **"Google Identity"** or **"Google+ API"**
- Click on **"Google Identity"** API
- Click **"Enable"**

#### 1.4 Create OAuth Credentials
- Go to **"APIs & Services"** → **"Credentials"**
- Click **"+ CREATE CREDENTIALS"**
- Select **"OAuth 2.0 Client IDs"**
- Configure consent screen if prompted:
  - Choose "External" user type
  - Fill required fields (App name: "Tribal Fashion")
  - Add your email as developer contact
  - Save and continue through steps

#### 1.5 Configure OAuth Client
- **Application type**: **Web application** ⚠️ **CRITICAL: Must be "Web application", NOT "Desktop application"**
- **Name**: "Tribal Fashion Web Client"
- **Authorized JavaScript origins** - Add these exactly:
  ```
  http://localhost:3000
  ```
- **Authorized redirect URIs** - Add these exactly:
  ```
  http://localhost:3000
  ```
  **Note**: Just the base URL, not `/api/auth/callback/google`
  (Add production domain later when deploying)

#### 1.6 Get Credentials
- Click **"Create"**
- **COPY** the Client ID and Client Secret
- Keep this popup open for the next step

### Step 2: Configure Environment Variables

#### Option A: Using the Setup Script (Recommended)
```bash
node setup-google-oauth.js
```
Follow the prompts and paste your credentials.

#### Option B: Manual Setup
1. Open `.env.local` file in your project root
2. Replace these lines:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your_actual_client_id_here"
GOOGLE_CLIENT_ID="your_actual_client_id_here" 
GOOGLE_CLIENT_SECRET="your_actual_client_secret_here"
```

### Step 3: Test the Setup

#### 3.1 Start Backend Server
```bash
cd backend
npm start
```
Should show: `Server running on port 5000`

#### 3.2 Start Frontend Server (New Terminal)
```bash
cd ..  # Back to root directory
npm run dev
```
Should show: `Ready - started server on 0.0.0.0:3000`

#### 3.3 Test Google Login
1. Open: http://localhost:3000/login
2. Click **"Continue with Google"**
3. Complete OAuth flow
4. Should redirect back authenticated

## Verification Checklist

- [ ] Google Cloud project created
- [ ] Google Identity API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Redirect URI configured correctly
- [ ] Client ID and Secret copied
- [ ] `.env.local` updated with credentials
- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Google login button works
- [ ] OAuth popup appears
- [ ] User gets redirected back authenticated

## Troubleshooting Common Issues

### ❌ "Error 400: redirect_uri_mismatch"
   - **Root Cause**: Redirect URI in Google Cloud Console doesn't match what the app sends
   - **Solution**: In Google Cloud Console, set redirect URI to just `http://localhost:3000` (not `/api/auth/callback/google`)
   - **See**: `REDIRECT_URI_FIX.md` for detailed fix instructions

### ❌ "Authorization Error: Storagerelay URI is not allowed for 'NATIVE_DESKTOP' client type"
   - **Root Cause**: OAuth application configured as "Desktop application" instead of "Web application"
   - **Solution**: Delete current OAuth credentials and recreate as "Web application"
   - **See**: `GOOGLE_OAUTH_FIX.md` for detailed fix instructions

### ❌ "Google authentication is not configured"
- Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`
- Restart development server after changing env vars

### ❌ "Authorization code is required" 
- Verify redirect URI in Google Cloud Console matches exactly:
  `http://localhost:3000/api/auth/callback/google`

### ❌ "Backend connection failed"
- Ensure backend is running on port 5000
- Check `BACKEND_URL="http://localhost:5000"` in `.env.local`

### ❌ OAuth popup blocked
- Allow popups for localhost in browser
- Try in incognito/private mode

### ❌ "Invalid client" error
- Double-check Client ID in Google Cloud Console
- Ensure no extra spaces in `.env.local`

## Security Notes

⚠️ **Important Security Practices:**
- Never commit `.env.local` to git (already in .gitignore)
- Use different credentials for production
- Regularly rotate client secrets
- Restrict redirect URIs to your actual domains

## Next Steps After Setup

Once Google OAuth is working:
1. Set up Apple Sign In (optional)
2. Configure Twilio for phone auth (optional)
3. Test all authentication flows
4. Deploy to production with production OAuth credentials

## Need Help?

If you encounter issues:
1. Check this guide first
2. Review console errors in browser dev tools
3. Check server logs for backend errors
4. Refer to `GOOGLE_OAUTH_SETUP.md` for additional details