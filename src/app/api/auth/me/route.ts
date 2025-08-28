import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    // Check for user context from middleware first
    const userContext = request.headers.get('x-user-context');
    const authMethod = request.headers.get('x-auth-method');
    
    if (userContext && authMethod) {
      const user = JSON.parse(userContext);
      
      // Return user data in consistent format regardless of auth method
      return NextResponse.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          authMethod: user.tokenType
        }
      });
    }
    
    // Fallback to original JWT verification for backward compatibility
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'No authorization header provided' },
        { status: 401 }
      );
    }
    
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: {
        Authorization: authHeader
      }
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch user profile',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}