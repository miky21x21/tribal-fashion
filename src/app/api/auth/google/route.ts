import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Initialize Google OAuth client
let googleClient: OAuth2Client;
try {
  googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
} catch (error) {
  console.error('Failed to initialize Google OAuth client:', error);
}

export async function POST(request: NextRequest) {
  try {
    // Check if Google client is initialized
    if (!googleClient) {
      return NextResponse.json(
        { success: false, message: 'Google OAuth is not configured properly' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Exchange authorization code for tokens
    // When using @react-oauth/google with auth-code flow, we need to set redirect_uri to 'postmessage'
    const { tokens } = await googleClient.getToken({
      code: code,
      redirect_uri: 'postmessage'
    });
    
    if (!tokens.id_token) {
      throw new Error('No ID token received from Google');
    }

    // Verify the ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid Google token payload');
    }

    // Call backend OAuth endpoint
    const response = await fetch(`${BACKEND_URL}/api/auth/oauth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: tokens.id_token,
        email: payload.email,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        googleId: payload.sub,
        avatar: payload.picture
      })
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Google authentication failed');
    }

    return NextResponse.json({
      success: true,
      data: {
        token: data.data.token,
        user: data.data.user
      }
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Google authentication failed'
      },
      { status: 500 }
    );
  }
}