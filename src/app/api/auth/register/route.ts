import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider } = body;
    
    let endpoint = '/api/auth/register';
    
    // Route to specific OAuth endpoints based on provider
    if (provider === 'google') {
      endpoint = '/api/auth/oauth/google';
    } else if (provider === 'apple') {
      endpoint = '/api/auth/oauth/apple';
    } else if (provider === 'phone') {
      endpoint = '/api/auth/phone/register';
    }
    
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
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