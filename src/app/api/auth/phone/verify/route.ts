import { NextRequest, NextResponse } from 'next/server'

// Development mode OTP storage (use Redis or database in production)
const verificationCodes = new Map<string, { code: string; expires: number }>()

// Check if Twilio is properly configured
function isTwilioConfigured(): boolean {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
  
  return !!(accountSid && 
           authToken && 
           phoneNumber &&
           accountSid.startsWith('AC') &&
           !accountSid.includes('your_') &&
           !authToken.includes('your_') &&
           !phoneNumber.includes('your_'));
}

// Initialize Twilio client safely
function getTwilioClient() {
  if (!isTwilioConfigured()) {
    return null;
  }
  
  try {
    // Dynamically import Twilio to avoid build-time issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Twilio = require('twilio');
    if (!Twilio) return null;
    return Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, action, code } = await req.json()

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      )
    }

    if (action === 'send') {
      // Generate 6-digit verification code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

      // Store verification code
      verificationCodes.set(phoneNumber, { code: otpCode, expires })

      const twilioClient = getTwilioClient();
      
      if (twilioClient && isTwilioConfigured()) {
        // Send SMS via Twilio if configured
        try {
          await twilioClient.messages.create({
            body: `Your Tribal Fashion verification code is: ${otpCode}. This code expires in 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
          });
          
          return NextResponse.json({
            success: true,
            message: 'Verification code sent successfully'
          })
        } catch (twilioError) {
          console.error('Twilio error:', twilioError)
          // Fall through to development mode
        }
      }
      
      // Development mode - log OTP to console
      console.log('\n🔐 DEVELOPMENT OTP CODE 🔐')
      console.log(`📱 Phone: ${phoneNumber}`)
      console.log(`🔑 Code: ${otpCode}`)
      console.log(`⏰ Expires: ${new Date(expires).toLocaleTimeString()}`)
      console.log('📝 Use this code for verification\n')
      
      return NextResponse.json({
        success: true,
        message: 'Development mode: Check console for verification code',
        developmentCode: otpCode // Include in development for easy testing
      })
    }

    if (action === 'verify') {
      if (!code) {
        return NextResponse.json(
          { success: false, message: 'Verification code is required' },
          { status: 400 }
        )
      }

      const storedData = verificationCodes.get(phoneNumber)
      
      if (!storedData) {
        return NextResponse.json(
          { success: false, message: 'No verification code found for this number' },
          { status: 400 }
        )
      }

      if (Date.now() > storedData.expires) {
        verificationCodes.delete(phoneNumber)
        return NextResponse.json(
          { success: false, message: 'Verification code has expired' },
          { status: 400 }
        )
      }

      if (storedData.code !== code) {
        return NextResponse.json(
          { success: false, message: 'Invalid verification code' },
          { status: 400 }
        )
      }

      // Code is valid - remove it
      verificationCodes.delete(phoneNumber)
      
      return NextResponse.json({
        success: true,
        message: 'Phone number verified successfully'
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Phone verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}