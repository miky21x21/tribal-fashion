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
      return await handleMultiProviderRegistration(body as AuthRequest & { firstName?: string; lastName?: string });
    }
    
    // Backward compatibility: treat as email/password registration
    if (body.email && body.password) {
      const emailAuthRequest: EmailAuthRequest & { firstName?: string; lastName?: string } = {
        authProvider: 'email',
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName
      };
      return await handleMultiProviderRegistration(emailAuthRequest);
    }
    
    // If no recognized format, pass through to backend for legacy handling
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to register user',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handleMultiProviderRegistration(authRequest: AuthRequest & { firstName?: string; lastName?: string }): Promise<NextResponse> {
  try {
    let backendEndpoint: string;
    let requestBody: Record<string, unknown>;
    
    switch (authRequest.authProvider) {
      case 'email':
        // Traditional email/password registration
        backendEndpoint = `${BACKEND_URL}/api/auth/register`;
        requestBody = {
          email: authRequest.email,
          password: authRequest.password,
          firstName: authRequest.firstName || '',
          lastName: authRequest.lastName || '',
          authProvider: 'email'
        };
        break;
        
      case 'google':
        // Process Google token and register/login user
        const { user: googleUser } = await processAuthRequest(authRequest);
        backendEndpoint = `${BACKEND_URL}/api/auth/social-register`;
        requestBody = {
          authProvider: 'google',
          token: authRequest.token,
          userData: {
            ...googleUser,
            firstName: authRequest.firstName || googleUser.firstName,
            lastName: authRequest.lastName || googleUser.lastName
          }
        };
        break;
        
      case 'apple':
        // Process Apple token and register/login user
        const { user: appleUser } = await processAuthRequest(authRequest);
        backendEndpoint = `${BACKEND_URL}/api/auth/social-register`;
        requestBody = {
          authProvider: 'apple',
          identityToken: authRequest.identityToken,
          userData: {
            ...appleUser,
            firstName: authRequest.firstName || appleUser.firstName,
            lastName: authRequest.lastName || appleUser.lastName
          },
          userInfo: authRequest.user
        };
        break;
        
      case 'phone':
        // Register with phone number (OTP should be pre-verified)
        backendEndpoint = `${BACKEND_URL}/api/auth/phone-register`;
        requestBody = {
          phoneNumber: authRequest.phoneNumber,
          otpCode: authRequest.otpCode,
          firstName: authRequest.firstName || '',
          lastName: authRequest.lastName || '',
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
        message: data.message || 'Registration successful',
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
    console.error(`Error during ${authRequest.authProvider} registration:`, error);
    
    // Provide specific error messages based on provider
    let errorMessage = 'Registration failed';
    if (authRequest.authProvider === 'google') {
      errorMessage = 'Google registration failed';
    } else if (authRequest.authProvider === 'apple') {
      errorMessage = 'Apple registration failed';
    } else if (authRequest.authProvider === 'phone') {
      errorMessage = 'Phone registration failed';
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