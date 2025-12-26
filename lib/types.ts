export interface Tweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  author?: {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
  };
}

export interface TweetResponse {
  data: Tweet[];
  includes?: {
    users?: Array<{
      id: string;
      name: string;
      username: string;
      profile_image_url?: string;
    }>;
  };
  meta?: {
    fallback?: boolean;
    message?: string;
    errorCode?: number;
    sortBy?: string;
    count?: number;
    query?: string;
  };
}
