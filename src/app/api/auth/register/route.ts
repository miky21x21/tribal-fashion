import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password } = body;

    // Validate required fields
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'All fields are required' 
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Please enter a valid email address' 
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 6 characters long' 
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User with this email already exists' 
        },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: `${firstName} ${lastName}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password: hashedPassword,
        emailVerified: new Date(), // Mark as verified since they're creating account
        role: 'user',
        authProvider: 'email'
      }
    });

    // Create user profile
    await prisma.userProfile.create({
      data: {
        userId: newUser.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase(),
        phoneNumber: '',
        street: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        avatar: '',
        profileComplete: false
      }
    });

    // Return success response (without password)
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        name: userWithoutPassword.name,
        role: userWithoutPassword.role,
        authProvider: userWithoutPassword.authProvider
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error during registration:', error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'User with this email already exists' 
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create account. Please try again.' 
      },
      { status: 500 }
    );
  }
}