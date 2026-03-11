import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.vapi.ai/call?limit=20', {
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_PRIVATE_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Vapi calls');
    }

    const calls = await response.json();

    return NextResponse.json({ calls });
  } catch (error) {
    console.error('Error fetching Vapi calls:', error);
    return NextResponse.json(
      { calls: [], error: String(error) },
      { status: 500 }
    );
  }
}
