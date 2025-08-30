import { NextRequest } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Initialize Google OAuth2 client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Auth provider types
export type AuthProvider = 'email' | 'google' | 'apple' | 'phone';

// Request interfaces for different auth methods
export interface EmailAuthRequest {
  authProvider: 'email';
  email: string;
  password: string;
}

export interface GoogleAuthRequest {
  authProvider: 'google';
  token: string;
}

export interface AppleAuthRequest {
  authProvider: 'apple';
  identityToken: string;
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export interface PhoneAuthRequest {
  authProvider: 'phone';
  phoneNumber: string;
  otpCode: string;
}

export type AuthRequest = EmailAuthRequest | GoogleAuthRequest | AppleAuthRequest | PhoneAuthRequest;

// Standard user interface that all providers should return
export interface StandardUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  authProvider: AuthProvider;
  providerId?: string; // ID from the provider (e.g., Google sub, Apple sub)
  phoneNumber?: string; // For phone auth
}

// Extract user context from middleware headers
export function getUserFromRequest(request: NextRequest) {
  const userContext = request.headers.get('x-user-context');
  const authMethod = request.headers.get('x-auth-method');
  
  if (userContext && authMethod) {
    return {
      user: JSON.parse(userContext),
      authMethod
    };
  }
  
  return null;
}

// Common interface for user data
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  authProvider?: AuthProvider;
  phoneNumber?: string;
}

// Check if user has required role
export function hasRole(user: AuthenticatedUser, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role);
}

// Middleware helper to require authentication
export function requireAuth(request: NextRequest) {
  const userContext = getUserFromRequest(request);
  
  if (!userContext) {
    throw new Error('Authentication required');
  }
  
  return userContext;
}

// Middleware helper to require specific roles
export function requireRole(request: NextRequest, requiredRoles: string[]) {
  const { user } = requireAuth(request);
  
  if (!hasRole(user, requiredRoles)) {
    throw new Error('Insufficient permissions');
  }
  
  return user;
}

// Verify Google ID token
export async function verifyGoogleToken(token: string): Promise<StandardUser> {
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token payload');
    }

    return {
      id: '', // Will be set by backend after user creation/lookup
      email: payload.email || '',
      firstName: payload.given_name || '',
      lastName: payload.family_name || '',
      role: 'user',
      authProvider: 'google',
      providerId: payload.sub,
    };
  } catch (error) {
    throw new Error(`Google token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Verify Apple ID token (basic implementation)
export async function verifyAppleToken(identityToken: string, user?: { firstName?: string; lastName?: string; email?: string }): Promise<StandardUser> {
  try {
    // For Apple ID tokens, we would normally verify the JWT signature
    // using Apple's public keys. For this implementation, we'll decode
    // the JWT payload and trust it (in production, proper verification is required)
    const payload = JSON.parse(atob(identityToken.split('.')[1]));
    
    return {
      id: '', // Will be set by backend after user creation/lookup
      email: user?.email || payload.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      role: 'user',
      authProvider: 'apple',
      providerId: payload.sub,
    };
  } catch (error) {
    throw new Error(`Apple token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Format phone number consistently
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  } else if (phoneNumber.startsWith('+')) {
    return phoneNumber;
  } else {
    return `+${cleaned}`;
  }
}

// Process authentication based on provider
export async function processAuthRequest(authRequest: AuthRequest): Promise<{ user: StandardUser; needsRegistration?: boolean }> {
  switch (authRequest.authProvider) {
    case 'google':
      const googleUser = await verifyGoogleToken(authRequest.token);
      return { user: googleUser };
      
    case 'apple':
      const appleUser = await verifyAppleToken(authRequest.identityToken, authRequest.user);
      return { user: appleUser };
      
    case 'phone':
      // For phone auth, we return the phone number as the identifier
      // The backend will handle OTP verification and user lookup/creation
      const formattedPhone = formatPhoneNumber(authRequest.phoneNumber);
      return {
        user: {
          id: '', // Will be set by backend
          email: '', // May not have email initially
          firstName: '',
          lastName: '',
          role: 'user',
          authProvider: 'phone',
          phoneNumber: formattedPhone,
        }
      };
      
    case 'email':
      // For email/password, we pass through to backend for verification
      return {
        user: {
          id: '', // Will be set by backend
          email: authRequest.email,
          firstName: '',
          lastName: '',
          role: 'user',
          authProvider: 'email',
        }
      };
      
    default:
      throw new Error('Unsupported authentication provider');
  }
}

// Generate JWT token with standardized user data
export async function generateJWTToken(user: StandardUser): Promise<string> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/generate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate JWT token');
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    throw new Error(`JWT token generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}