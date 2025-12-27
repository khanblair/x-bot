import { NextResponse } from 'next/server';

export async function GET() {
  // Stub implementation to prevent crash and restore RateLimitIndicator functionality
  // TODO: Implement real Twitter rate limit fetching via Twitter API or Convex backend

  const now = new Date();
  const resetTime = new Date(now.getTime() + 15 * 60 * 1000).toISOString(); // 15 mins from now

  return NextResponse.json({
    reads: {
      limit: 15,
      remaining: 15,
      reset: resetTime,
      used: 0,
      percentage: 0
    },
    posts: {
      limit: 5, // Conservative default
      remaining: 5,
      reset: resetTime,
      used: 0,
      percentage: 0
    }
  });
}
