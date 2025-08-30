import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'No authorization header provided' },
        { status: 401 }
      );
    }
    
    const { id } = await params;
    const response = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
      headers: {
        Authorization: authHeader
      }
    });
    
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch order',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}