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
    console.log('Google OAuth route called');
    
    // Check if Google client is initialized
    if (!googleClient) {
      console.error('Google OAuth client not initialized');
      return NextResponse.json(
        { success: false, message: 'Google OAuth is not configured properly' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);
    const { code } = body;

    if (!code) {
      console.error('No authorization code provided');
      return NextResponse.json(
        { success: false, message: 'Authorization code is required' },
        { status: 400 }
      );
    }

    console.log('Exchanging code for tokens...');
    // Exchange authorization code for tokens
    // When using @react-oauth/google with auth-code flow, we need to set redirect_uri to 'postmessage'
    const { tokens } = await googleClient.getToken({
      code: code,
      redirect_uri: 'postmessage'
    });
    
    console.log('Tokens received, verifying ID token...');
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

    console.log('Token verified, calling backend...');
    // Call backend OAuth endpoint with verified payload data
    const response = await fetch(`${BACKEND_URL}/api/auth/oauth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
        firstName: payload.given_name || '',
        lastName: payload.family_name || '',
        googleId: payload.sub,
        avatar: payload.picture,
        verified: true // Flag to indicate token was already verified
      })
    });

    const data = await response.json();
    console.log('Backend response:', data);
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Google authentication failed');
    }

    console.log('OAuth successful, returning user data');
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