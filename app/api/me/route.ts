import { twitterClient } from '@/lib/twitter-client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const me = await twitterClient.v2.me({
      'user.fields': ['name', 'username', 'profile_image_url', 'public_metrics'],
    });

    return NextResponse.json({
      data: me.data,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: unknown) {
    console.error('Twitter API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
