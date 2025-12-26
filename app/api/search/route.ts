import { twitterClient } from '@/lib/twitter-client';
import { fallbackTweets, fallbackUsers } from '@/lib/sample-tweets';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function sortTweets(tweets: any[], sortBy: string): any[] {
  const tweetsCopy = [...tweets];
  switch (sortBy) {
    case 'likes':
      return tweetsCopy.sort((a, b) => 
        (b.public_metrics?.like_count || 0) - (a.public_metrics?.like_count || 0)
      );
    case 'retweets':
      return tweetsCopy.sort((a, b) => 
        (b.public_metrics?.retweet_count || 0) - (a.public_metrics?.retweet_count || 0)
      );
    case 'replies':
      return tweetsCopy.sort((a, b) => 
        (b.public_metrics?.reply_count || 0) - (a.public_metrics?.reply_count || 0)
      );
    default:
      return tweetsCopy.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'javascript OR typescript OR nextjs';
    const maxResults = parseInt(searchParams.get('max') || '20', 10);
    const sortBy = searchParams.get('sortBy') || 'latest';

    const searchQuery = `${query} lang:en -is:retweet`;

    const searchResults = await twitterClient.v2.search(searchQuery, {
      max_results: Math.min(maxResults, 100),
      'tweet.fields': ['created_at', 'public_metrics', 'author_id'],
      'user.fields': ['name', 'username', 'profile_image_url'],
      expansions: ['author_id'],
      sort_order: 'recency',
    });

    const tweets: any[] = [];
    for await (const tweet of searchResults) {
      tweets.push(tweet);
    }

    const sortedTweets = sortTweets(tweets, sortBy);

    return NextResponse.json({
      data: sortedTweets,
      includes: { users: searchResults.includes?.users || [] },
      meta: { fallback: false, query, sortBy, count: sortedTweets.length },
    }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } });
  } catch (error: any) {
    console.error('Twitter API Error:', error);
    return NextResponse.json({
      data: fallbackTweets,
      includes: { users: fallbackUsers },
      meta: {
        fallback: true,
        message: error.code === 429 
          ? 'API rate limited. Showing cached results.' 
          : error.message || 'Failed to search tweets',
        errorCode: error.code || 500,
      },
    }, { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } });
  }
}
