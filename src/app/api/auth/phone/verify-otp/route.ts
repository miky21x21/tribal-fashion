import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Add country code if not present (assuming US +1)
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('+')) {
    return phoneNumber;
  } else {
    return `+${cleaned}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, otpCode } = body;

    if (!phoneNumber || !otpCode) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP code are required' },
        { status: 400 }
      );
    }

    // Validate OTP format (should be 6 digits)
    if (!/^\d{6}$/.test(otpCode)) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP format. Must be 6 digits.' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);

    try {
      // Verify OTP via backend API
      const verifyResponse = await fetch(`${BACKEND_URL}/api/auth/phone/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          otpCode,
        })
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        return NextResponse.json(
          { 
            success: false, 
            message: verifyData.message || 'OTP verification failed',
            error: verifyData.error
          },
          { status: verifyResponse.status }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
        phoneNumber: formattedPhone,
        data: verifyData.data,
      });

    } catch (backendError) {
      console.error('Backend error:', backendError);
      return NextResponse.json(
        { success: false, message: 'Failed to verify OTP' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to verify OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}