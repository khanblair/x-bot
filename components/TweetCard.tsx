'use client';

import { Tweet } from '@/lib/types';
import { Heart, MessageCircle, Repeat2, Share2 } from 'lucide-react';
import Image from 'next/image';
import { GlassCard } from './GlassCard';
import { ShareButton } from './ShareButton';

interface TweetCardProps {
  tweet: Tweet;
}

export function TweetCard({ tweet }: TweetCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <GlassCard hover className="p-6 space-y-4">
      {/* Author Info */}
      <div className="flex items-start gap-3">
        {tweet.author?.profile_image_url ? (
          <Image
            src={tweet.author.profile_image_url}
            alt={tweet.author.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-twitter-blue to-purple-500" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-foreground truncate">
              {tweet.author?.name || 'Unknown User'}
            </h3>
            <span className="text-muted text-sm">
              @{tweet.author?.username || 'unknown'}
            </span>
            <span className="text-muted text-sm">·</span>
            <span className="text-muted text-sm">{formatDate(tweet.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Tweet Text */}
      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
        {tweet.text}
      </p>

      {/* Engagement Metrics */}
      {tweet.public_metrics && (
        <div className="flex items-center gap-6 pt-2">
          <button className="flex items-center gap-2 text-muted hover:text-twitter-blue transition-colors group">
            <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm">
              {formatNumber(tweet.public_metrics.reply_count)}
            </span>
          </button>
          <button className="flex items-center gap-2 text-muted hover:text-green-500 transition-colors group">
            <Repeat2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm">
              {formatNumber(tweet.public_metrics.retweet_count)}
            </span>
          </button>
          <button className="flex items-center gap-2 text-muted hover:text-red-500 transition-colors group">
            <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm">
              {formatNumber(tweet.public_metrics.like_count)}
            </span>
          </button>
          <ShareButton tweet={tweet} />
        </div>
      )}
    </GlassCard>
  );
}
