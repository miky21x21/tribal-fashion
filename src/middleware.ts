import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

interface JWTUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  authProvider?: string;
  phoneNumber?: string;
  providerId?: string;
}

// JWT verification utility
async function verifyJWT(token: string): Promise<JWTUser> {
  try {
    // For production, you'd use a proper JWT library like jsonwebtoken
    // Here we'll make a request to the backend to verify the token
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
    
    const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('JWT verification failed');
    }
    
    const data = await response.json();
    return data.user;
  } catch {
    throw new Error('Invalid JWT token');
  }
}

// Extract user info from JWT token
function extractUserInfo(user: JWTUser) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role || 'user',
    authProvider: user.authProvider || 'email',
    phoneNumber: user.phoneNumber,
    providerId: user.providerId
  };
}

// Extract user info from NextAuth token
function extractNextAuthUserInfo(token: any) {
  return {
    id: token.sub || token.id || 'unknown',
    email: token.email || '',
    firstName: token.firstName || token.name?.split(' ')[0] || '',
    lastName: token.lastName || token.name?.split(' ').slice(1).join(' ') || '',
    role: token.role || 'user',
    authProvider: token.provider || 'oauth',
    phoneNumber: token.phoneNumber || '',
    providerId: token.sub || token.id || 'unknown'
  };
}

export async function middleware(request: NextRequest) {
  // Skip middleware for static files, public routes, and NextAuth routes
  const pathname = request.nextUrl.pathname;
  
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/api/auth/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/' ||
    pathname === '/shop' ||
    pathname === '/about' ||
    pathname === '/contact'
  ) {
    return NextResponse.next();
  }
  
  let user = null;
  let authMethod = null;
  
  // First, try to authenticate with NextAuth session
  try {
    const nextAuthToken = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });
    
    if (nextAuthToken) {
      user = extractNextAuthUserInfo(nextAuthToken);
      authMethod = 'nextauth';
      console.log('✅ NextAuth session found:', user.email);
    }
  } catch (error) {
    console.log('❌ NextAuth session check failed:', error);
  }
  
  // If no NextAuth session, try to authenticate with JWT token
  if (!user) {
    const authHeader = request.headers.get('authorization');
    const jwtToken = authHeader?.replace('Bearer ', '');
    
    if (jwtToken) {
      try {
        const jwtUser = await verifyJWT(jwtToken);
        user = extractUserInfo(jwtUser);
        authMethod = 'jwt';
        console.log('✅ JWT token verified:', user.email);
      } catch (error) {
        console.log('❌ JWT verification failed:', error);
      }
    }
  }
  
  // If no valid authentication found for protected routes
  if (!user && isProtectedRoute(pathname)) {
    console.log('❌ No authentication found for protected route:', pathname);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Authentication required'
      }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  
  // Create response and add user context to headers for downstream handlers
  const response = NextResponse.next();
  
  if (user) {
    // Add user context to request headers for API routes
    response.headers.set('x-user-id', user.id);
    response.headers.set('x-user-email', user.email);
    response.headers.set('x-user-role', user.role);
    response.headers.set('x-auth-method', authMethod || 'none');
    
    // For client-side access, add user info to a custom header
    response.headers.set('x-user-context', JSON.stringify(user));
    
    console.log('✅ User authenticated via', authMethod, ':', user.email);
  }
  
  return response;
}

function isProtectedRoute(pathname: string): boolean {
  const protectedPrefixes = [
    '/api/orders',
    '/api/profile',
    '/api/admin',
    '/dashboard',
    '/admin'
  ];
  
  // Allow /api/auth/me to pass through for user profile fetching
  if (pathname === '/api/auth/me') {
    return false;
  }
  
  // Don't protect client-side profile page - it handles auth internally
  if (pathname === '/profile') {
    return false;
  }
  
  return protectedPrefixes.some(prefix => pathname.startsWith(prefix));
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};