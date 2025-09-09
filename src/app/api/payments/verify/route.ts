import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import crypto from 'crypto';
import { createDeliveryNotification, sendDeliveryNotification } from '@/lib/delivery-notifications';

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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Payment verification data is required' },
        { status: 400 }
      );
    }

    if (!orderData) {
      return NextResponse.json(
        { success: false, message: 'Order data is required' },
        { status: 400 }
      );
    }

    // Verify payment signature
    const body_signature = razorpay_order_id + "|" + razorpay_payment_id;
    const expected_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body_signature.toString())
      .digest("hex");

    if (expected_signature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Payment verified successfully, create order via backend
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.id}`,
      },
      body: JSON.stringify({
        ...orderData,
        paymentMethod: 'ONLINE',
        paymentId: razorpay_payment_id,
        paymentOrderId: razorpay_order_id
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create order');
    }

    // Send delivery notification
    try {
      const notification = createDeliveryNotification(data.data);
      await sendDeliveryNotification(notification);
    } catch (notificationError) {
      console.error('Failed to send delivery notification:', notificationError);
      // Don't fail the order if notification fails
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      payment: {
        id: razorpay_payment_id,
        order_id: razorpay_order_id,
        status: 'captured'
      },
      message: 'Payment verified and order created successfully'
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
