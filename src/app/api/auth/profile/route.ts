import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    // Get user context from middleware
    const userContext = request.headers.get('x-user-context');
    const authMethod = request.headers.get('x-auth-method');
    
    if (userContext && authMethod) {
      const user = JSON.parse(userContext);
      
      return NextResponse.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          phoneNumber: user.phoneNumber,
          street: user.street,
          apartment: user.apartment,
          city: user.city,
          state: user.state,
          zipCode: user.zipCode,
          country: user.country,
          profileComplete: user.profileComplete,
          role: user.role
        }
      });
    }
    
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, avatar, phoneNumber, street, apartment, city, state, zipCode, country } = body;
    
    // Get authorization token
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'No authorization header provided' },
        { status: 401 }
      );
    }
    
    // Forward to backend
    const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        avatar,
        phoneNumber,
        street,
        apartment,
        city,
        state,
        zipCode,
        country
      })
    });
    
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}