import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client - only if credentials are provided and not placeholders
const twilioClient = TWILIO_ACCOUNT_SID && 
                    TWILIO_AUTH_TOKEN && 
                    !TWILIO_ACCOUNT_SID.includes('your_') && 
                    !TWILIO_AUTH_TOKEN.includes('your_') &&
                    TWILIO_ACCOUNT_SID.startsWith('AC')
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null;

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

function validatePhoneNumber(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/\D/g, '');
  // US phone numbers should have 10 digits, or 11 with country code
  return cleaned.length === 10 || (cleaned.length === 11 && cleaned.startsWith('1'));
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    const otpCode = generateOTP();

    // Check if Twilio is configured
    if (!twilioClient || !TWILIO_PHONE_NUMBER) {
      return NextResponse.json(
        { success: false, message: 'SMS service not configured' },
        { status: 500 }
      );
    }

    try {
      // Store OTP in database via backend API
      const storeResponse = await fetch(`${BACKEND_URL}/api/auth/phone/store-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          otpCode,
        })
      });

      if (!storeResponse.ok) {
        throw new Error('Failed to store OTP in database');
      }

      // Send SMS via Twilio
      await twilioClient.messages.create({
        body: `Your verification code is: ${otpCode}. This code will expire in 10 minutes.`,
        from: TWILIO_PHONE_NUMBER,
        to: formattedPhone,
      });

      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
        phoneNumber: formattedPhone,
      });

    } catch (twilioError) {
      console.error('Twilio error:', twilioError);
      return NextResponse.json(
        { success: false, message: 'Failed to send SMS' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send OTP',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}