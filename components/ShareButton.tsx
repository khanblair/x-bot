'use client';

import { Tweet } from '@/lib/types';
import { Share2 } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonProps {
  tweet: Tweet;
}

export function ShareButton({ tweet }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const tweetUrl = `https://twitter.com/${tweet.author?.username}/status/${tweet.id}`;
    const shareData = {
      title: `Tweet by ${tweet.author?.name}`,
      text: tweet.text,
      url: tweetUrl,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(tweetUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 text-muted hover:text-twitter-blue transition-colors group relative"
      aria-label="Share tweet"
    >
      <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
      {copied && (
        <span className="absolute -top-8 left-0 text-xs bg-green-500 text-white px-2 py-1 rounded">
          Copied!
        </span>
      )}
    </button>
  );
}
