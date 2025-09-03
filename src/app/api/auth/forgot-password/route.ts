import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({
        success: false,
        message: 'Email is required'
      }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Please enter a valid email address'
      }, { status: 400 });
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    
    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: 'If this email is registered, you will receive a password reset link'
      });
    }
    
    // Generate reset token
    const resetToken = sign(
      { 
        id: user.id, 
        email: user.email, 
        type: 'password_reset' 
      },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );
    
    // In a real application, you would:
    // 1. Save the reset token to database with expiration
    // 2. Send email with reset link
    // For now, we'll just return success with the token for development
    
    // Create reset link
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email',
      // In development, include the reset link for testing
      ...(process.env.NODE_ENV === 'development' && { 
        resetLink,
        resetToken 
      })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process password reset request'
    }, { status: 500 });
  }
}