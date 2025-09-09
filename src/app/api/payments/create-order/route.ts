import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, currency, orderData } = body;

    // Validate required fields
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Valid amount is required' },
        { status: 400 }
      );
    }

    if (!orderData) {
      return NextResponse.json(
        { success: false, message: 'Order data is required' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: currency || 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        userId: session.user.id,
        orderData: JSON.stringify(orderData)
      }
    });

    return NextResponse.json({
      success: true,
      order: razorpayOrder,
      message: 'Payment order created successfully'
    });

  } catch (error) {
    console.error('Create payment order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
