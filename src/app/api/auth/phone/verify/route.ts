import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

// Initialize Twilio client safely
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken || !accountSid.startsWith('AC')) {
    return null;
  }
  
  return twilio(accountSid, authToken);
};

// In production, use Redis or database to store verification codes
const verificationCodes = new Map<string, { code: string; expires: number }>()

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, action } = await req.json()

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    if (action === 'send') {
      // Generate 6-digit verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const expires = Date.now() + 10 * 60 * 1000 // 10 minutes

      // Store verification code (in production, use Redis or database)
      verificationCodes.set(phoneNumber, { code, expires })

      // Send SMS via Twilio
      try {
        const client = getTwilioClient();
        
        if (!client) {
          return NextResponse.json({ error: 'SMS service not configured' }, { status: 500 })
        }
        
        await client.messages.create({
          body: `Your verification code is: ${code}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber,
        });

        return NextResponse.json({ message: 'Verification code sent successfully' })
      } catch (twilioError) {
        console.error('Twilio error:', twilioError)
        return NextResponse.json({ error: 'Failed to send SMS. Please check Twilio configuration.' }, { status: 500 })
      }
    }

    if (action === 'verify') {
      const { code, firstName, lastName } = await req.json()

      if (!code) {
        return NextResponse.json({ error: 'Verification code is required' }, { status: 400 })
      }

      const storedData = verificationCodes.get(phoneNumber)
      
      if (!storedData) {
        return NextResponse.json({ error: 'No verification code found for this number' }, { status: 400 })
      }

      if (Date.now() > storedData.expires) {
        verificationCodes.delete(phoneNumber)
        return NextResponse.json({ error: 'Verification code has expired' }, { status: 400 })
      }

      if (storedData.code !== code) {
        return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 })
      }

      // Remove verification code
      verificationCodes.delete(phoneNumber)

      return NextResponse.json({
        message: 'Phone number verified successfully',
        user: {
          phoneNumber,
          firstName: firstName || '',
          lastName: lastName || '',
          profileComplete: !!(firstName && lastName),
        }
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Phone verification error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}