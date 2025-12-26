import { Tweet } from '@/lib/types';

const fallbackDate = new Date().toISOString();

export const fallbackTweets: Tweet[] = [
  {
    id: '1',
    text: 'This is a fallback tweet served when the Twitter API cannot be reached. You can still explore cached content offline.',
    author_id: 'bot',
    created_at: fallbackDate,
    public_metrics: {
      retweet_count: 12,
      reply_count: 5,
      like_count: 48,
      quote_count: 1,
    },
  },
  {
    id: '2',
    text: 'Keep your API keys ready and Twitter will become your feed. The bot will automatically refresh when a live request succeeds.',
    author_id: 'bot',
    created_at: fallbackDate,
    public_metrics: {
      retweet_count: 4,
      reply_count: 2,
      like_count: 16,
      quote_count: 0,
    },
  },
];

export const fallbackUsers = [
  {
    id: 'bot',
    name: 'X-Bot Fallback',
    username: 'x_bot_fallback',
    profile_image_url: 'https://pbs.twimg.com/profile_images/1590968738358079488/IY9Gx6Ok_normal.jpg',
  },
];
