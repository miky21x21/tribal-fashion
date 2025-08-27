import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:5000/api/products/featured');
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch featured products',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}