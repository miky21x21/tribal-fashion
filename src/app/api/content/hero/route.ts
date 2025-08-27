import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, return mock data since we don't have a hero content endpoint in backend yet
    const mockHeroContent = {
      success: true,
      data: {
        content: "Discover the Rich Heritage of Jharkhand's Tribal Fashion",
        image: "/images/hero-bg.jpg"
      }
    };
    
    return NextResponse.json(mockHeroContent);
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch hero content',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}