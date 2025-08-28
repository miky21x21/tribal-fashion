import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

interface JWTUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface NextAuthUser {
  sub?: string;
  id?: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
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

// Extract user info consistently from both token types
function extractUserInfo(user: JWTUser | NextAuthUser, tokenType: 'jwt' | 'nextauth') {
  if (tokenType === 'nextauth') {
    const nextAuthUser = user as NextAuthUser;
    return {
      id: nextAuthUser.sub || nextAuthUser.id || '',
      email: nextAuthUser.email,
      firstName: nextAuthUser.name?.split(' ')[0] || nextAuthUser.firstName || '',
      lastName: nextAuthUser.name?.split(' ').slice(1).join(' ') || nextAuthUser.lastName || '',
      role: nextAuthUser.role || 'user',
      tokenType: 'nextauth'
    };
  } else {
    const jwtUser = user as JWTUser;
    return {
      id: jwtUser.id,
      email: jwtUser.email,
      firstName: jwtUser.firstName,
      lastName: jwtUser.lastName,
      role: jwtUser.role || 'user',
      tokenType: 'jwt'
    };
  }
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
  
  // First, try to authenticate with JWT token
  const authHeader = request.headers.get('authorization');
  const jwtToken = authHeader?.replace('Bearer ', '');
  
  if (jwtToken) {
    try {
      const jwtUser = await verifyJWT(jwtToken);
      user = extractUserInfo(jwtUser, 'jwt');
      authMethod = 'jwt';
    } catch {
      // JWT verification failed, continue to NextAuth check
    }
  }
  
  // If JWT authentication failed or wasn't provided, try NextAuth
  if (!user) {
    try {
      const nextAuthToken = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
      });
      
      if (nextAuthToken) {
        user = extractUserInfo(nextAuthToken as NextAuthUser, 'nextauth');
        authMethod = 'nextauth';
      }
    } catch {
      // NextAuth verification failed
    }
  }
  
  // If no valid authentication found for protected routes
  if (!user && isProtectedRoute(pathname)) {
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
  }
  
  return response;
}

function isProtectedRoute(pathname: string): boolean {
  const protectedPrefixes = [
    '/api/orders',
    '/api/profile',
    '/api/admin',
    '/dashboard',
    '/profile',
    '/admin'
  ];
  
  // Allow /api/auth/me to pass through for user profile fetching
  if (pathname === '/api/auth/me') {
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