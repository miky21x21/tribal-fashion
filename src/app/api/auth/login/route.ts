import { NextRequest, NextResponse } from 'next/server';
import { 
  AuthRequest, 
  processAuthRequest,
  EmailAuthRequest
} from '@/utils/auth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if authProvider is specified for new multi-provider auth
    if (body.authProvider) {
      return await handleMultiProviderAuth(body as AuthRequest);
    }
    
    // Backward compatibility: treat as email/password auth
    if (body.email && body.password) {
      const emailAuthRequest: EmailAuthRequest = {
        authProvider: 'email',
        email: body.email,
        password: body.password
      };
      return await handleMultiProviderAuth(emailAuthRequest);
    }
    
    // If no recognized format, pass through to backend for legacy handling
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to login user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handleMultiProviderAuth(authRequest: AuthRequest): Promise<NextResponse> {
  try {
    let backendEndpoint: string;
    let requestBody: Record<string, unknown>;
    
    switch (authRequest.authProvider) {
      case 'email':
        // Traditional email/password authentication
        backendEndpoint = `${BACKEND_URL}/api/auth/login`;
        requestBody = {
          email: authRequest.email,
          password: authRequest.password,
          authProvider: 'email'
        };
        break;
        
      case 'google':
        // Process Google token and prepare for backend
        const { user: googleUser } = await processAuthRequest(authRequest);
        backendEndpoint = `${BACKEND_URL}/api/auth/social-login`;
        requestBody = {
          authProvider: 'google',
          token: authRequest.token,
          userData: googleUser
        };
        break;
        
      case 'apple':
        // Process Apple token and prepare for backend
        const { user: appleUser } = await processAuthRequest(authRequest);
        backendEndpoint = `${BACKEND_URL}/api/auth/social-login`;
        requestBody = {
          authProvider: 'apple',
          identityToken: authRequest.identityToken,
          userData: appleUser,
          userInfo: authRequest.user
        };
        break;
        
      case 'phone':
        // Verify OTP and authenticate with phone number
        backendEndpoint = `${BACKEND_URL}/api/auth/phone-login`;
        requestBody = {
          phoneNumber: authRequest.phoneNumber,
          otpCode: authRequest.otpCode,
          authProvider: 'phone'
        };
        break;
        
      default:
        throw new Error('Unsupported authentication provider');
    }
    
    // Call backend with processed request
    const response = await fetch(backendEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    // Standardize response format
    if (response.ok && data.success) {
      // Ensure consistent user object structure in response
      const standardizedResponse = {
        success: true,
        message: data.message || 'Authentication successful',
        token: data.token,
        user: {
          id: data.user.id,
          email: data.user.email || '',
          firstName: data.user.firstName || '',
          lastName: data.user.lastName || '',
          role: data.user.role || 'user',
          authProvider: authRequest.authProvider,
          phoneNumber: data.user.phoneNumber || (authRequest.authProvider === 'phone' ? authRequest.phoneNumber : undefined),
          providerId: data.user.providerId,
        }
      };
      
      return NextResponse.json(standardizedResponse, { status: 200 });
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error(`Error during ${authRequest.authProvider} authentication:`, error);
    
    // Provide specific error messages based on provider
    let errorMessage = 'Authentication failed';
    if (authRequest.authProvider === 'google') {
      errorMessage = 'Google authentication failed';
    } else if (authRequest.authProvider === 'apple') {
      errorMessage = 'Apple authentication failed';
    } else if (authRequest.authProvider === 'phone') {
      errorMessage = 'Phone authentication failed';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}