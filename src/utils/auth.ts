import { NextRequest } from 'next/server';

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

// Common interface for user data regardless of auth method
export interface AuthenticatedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tokenType: 'jwt' | 'nextauth';
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