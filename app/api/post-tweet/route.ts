import { NextRequest, NextResponse } from 'next/server';
import { twitterClient } from '@/lib/twitter-client';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Tweet text is required' },
        { status: 400 }
      );
    }

    if (text.length > 280) {
      return NextResponse.json(
        { error: 'Tweet exceeds 280 character limit' },
        { status: 400 }
      );
    }

    // Post tweet to Twitter
    const tweet = await twitterClient.v2.tweet(text);

    return NextResponse.json(
      {
        success: true,
        tweet: {
          id: tweet.data.id,
          text: tweet.data.text,
        },
      },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error: any) {
    console.error('Error posting tweet:', {
      error,
      type: error?.type,
      code: error?.code,
      message: error?.message,
      rateLimit: error?.rateLimit,
    });

    // Handle rate limiting
    if (error?.code === 429 || error?.rateLimit?.remaining === 0) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: error?.rateLimit?.reset,
        },
        { status: 429 }
      );
    }

    // Handle authentication errors
    if (error?.code === 401 || error?.code === 403) {
      return NextResponse.json(
        { error: 'Authentication failed. Please check your API credentials.' },
        { status: 403 }
      );
    }

    // Handle duplicate tweets
    if (error?.code === 187) {
      return NextResponse.json(
        { error: 'Duplicate tweet. You already posted this recently.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to post tweet' },
      { status: 500 }
    );
  }
}
