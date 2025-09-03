# 🚀 Complete OAuth Setup Guide for Google & Apple Sign-In

## ✅ **What's Been Fixed:**

1. **NextAuth.js Integration** - Proper OAuth framework implemented
2. **Google OAuth** - Fixed the broken Google sign-in
3. **Apple Sign-In** - Added Apple authentication support
4. **Prisma Integration** - Database adapter for user management
5. **Session Management** - Proper authentication state handling

## 🔧 **Required Environment Variables:**

Create a `.env.local` file in your project root with:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET="generate-a-32-character-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Apple Sign In
APPLE_ID="your-apple-service-id"
APPLE_SECRET="your-apple-private-key"

# Database
DATABASE_URL="your-database-connection-string"

# Backend API
BACKEND_URL="http://localhost:5000"
```

## 🌐 **Google OAuth Setup:**

### 1. Go to Google Cloud Console:
- Visit: https://console.cloud.google.com/
- Create a new project or select existing one

### 2. Enable Google+ API:
- Go to "APIs & Services" > "Library"
- Search for "Google+ API" and enable it

### 3. Create OAuth 2.0 Credentials:
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth 2.0 Client IDs"
- Application type: "Web application"
- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### 4. Copy Credentials:
- Copy `Client ID` and `Client Secret`
- Add to your `.env.local` file

## 🍎 **Apple Sign-In Setup:**

### 1. Apple Developer Account:
- Visit: https://developer.apple.com/
- Sign in with your Apple ID

### 2. Create App ID:
- Go to "Certificates, Identifiers & Profiles"
- Click "Identifiers" > "+" > "App IDs"
- Select "App" and fill in details
- Enable "Sign In with Apple"

### 3. Create Service ID:
- Go to "Identifiers" > "+" > "Services IDs"
- Description: "Your App Sign In with Apple"
- Identifier: `com.yourapp.signin`
- Enable "Sign In with Apple"

### 4. Configure Sign In with Apple:
- Click "Configure" next to "Sign In with Apple"
- Primary App ID: Select your app
- Domains and Subdomains: `localhost`
- Return URLs: `http://localhost:3000/api/auth/callback/apple`

### 5. Create Private Key:
- Go to "Keys" > "+"
- Key Name: "Sign In with Apple Key"
- Enable "Sign In with Apple"
- Download the `.p8` file
- Note the Key ID

### 6. Generate Client Secret:
- Use the `.p8` file and Key ID to generate a client secret
- Add to your `.env.local` file

## 🗄️ **Database Setup:**

### 1. Install Prisma:
```bash
npm install prisma @prisma/client
```

### 2. Initialize Prisma:
```bash
npx prisma init
```

### 3. Update `prisma/schema.prisma`:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### 4. Generate and Run Migrations:
```bash
npx prisma generate
npx prisma db push
```

## 🚀 **Testing the Setup:**

### 1. Start Your Development Server:
```bash
npm run dev
```

### 2. Test Google Sign-In:
- Go to `/login`
- Click "Sign in with Google"
- Should redirect to Google OAuth
- After authorization, redirects to `/dashboard`

### 3. Test Apple Sign-In:
- Go to `/login`
- Click "Sign in with Apple ID"
- Should redirect to Apple OAuth
- After authorization, redirects to `/dashboard`

## 🔍 **Troubleshooting:**

### Google OAuth Issues:
- ✅ Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- ✅ Verify redirect URI in Google Console
- ✅ Ensure Google+ API is enabled

### Apple Sign-In Issues:
- ✅ Check `APPLE_ID` and `APPLE_SECRET`
- ✅ Verify Service ID configuration
- ✅ Check private key format

### Database Issues:
- ✅ Verify `DATABASE_URL` is correct
- ✅ Run `npx prisma generate`
- ✅ Check database connection

### NextAuth Issues:
- ✅ Verify `NEXTAUTH_SECRET` is 32+ characters
- ✅ Check `NEXTAUTH_URL` matches your domain
- ✅ Ensure all environment variables are set

## 📱 **Mobile Considerations:**

- **Google OAuth**: Works on all devices
- **Apple Sign-In**: iOS 13+ required, works on web and iOS
- **Responsive Design**: Login form is mobile-optimized

## 🎯 **Next Steps:**

1. **Set up environment variables** in `.env.local`
2. **Configure Google OAuth** in Google Cloud Console
3. **Configure Apple Sign-In** in Apple Developer Console
4. **Set up database** with Prisma
5. **Test both authentication methods**
6. **Customize user experience** as needed

Your OAuth setup is now complete and should work perfectly! 🎉
