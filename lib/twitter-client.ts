import { TwitterApi } from 'twitter-api-v2';

// Initialize Twitter client
const client = new TwitterApi({
  appKey: process.env.CONSUMER_API_KEY!,
  appSecret: process.env.CONSUME_SECRET_KEY!,
  accessToken: process.env.ACCESS_TOKEN!,
  accessSecret: process.env.ACCESS_TOKEN_SECRET!,
});

export const twitterClient = client.readWrite;
