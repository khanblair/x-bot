'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Send, Eye, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ComposeTweetProps {
  onClose?: () => void;
}

export function ComposeTweet({ onClose }: ComposeTweetProps) {
  const [text, setText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const queryClient = useQueryClient();

  const postTweet = useMutation({
    mutationFn: async (tweetText: string) => {
      const response = await fetch('/api/post-tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tweetText }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to post tweet');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to refresh feed
      queryClient.invalidateQueries({ queryKey: ['tweets'] });
      setText('');
      setShowPreview(false);
      if (onClose) onClose();
    },
  });

  const handleSubmit = () => {
    if (text.trim() && text.length <= 280) {
      postTweet.mutate(text);
    }
  };

  const characterCount = text.length;
  const isOverLimit = characterCount > 280;
  const characterColor = 
    characterCount === 0 ? 'text-muted' :
    characterCount > 260 ? 'text-red-500' :
    characterCount > 240 ? 'text-yellow-500' :
    'text-twitter-blue';

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Compose Tweet</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!showPreview ? (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening?"
            className="w-full min-h-[120px] px-4 py-3 rounded-2xl glass-card focus:outline-none focus:ring-2 focus:ring-twitter-blue resize-none"
            disabled={postTweet.isPending}
          />

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-full hover:bg-twitter-blue/20 text-twitter-blue transition-colors"
                title="Add image (coming soon)"
                disabled
              >
                <ImageIcon className="w-5 h-5 opacity-50" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${characterColor}`}>
                {characterCount}/280
              </span>
              
              <button
                onClick={() => setShowPreview(true)}
                disabled={!text.trim() || isOverLimit || postTweet.isPending}
                className="btn-secondary px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>
          </div>

          {isOverLimit && (
            <p className="text-red-500 text-sm mt-2">
              Tweet is {characterCount - 280} characters over the limit
            </p>
          )}

          {postTweet.error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-700 dark:text-red-300">
              <p className="text-sm">{postTweet.error.message}</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mb-4">
            <h4 className="text-sm font-medium text-muted mb-2">Preview</h4>
            <GlassCard className="p-4">
              <div className="flex gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-twitter-blue to-purple-500 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold">Your Account</span>
                    <span className="text-muted text-sm">@username · now</span>
                  </div>
                  <p className="whitespace-pre-wrap break-words">{text}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => setShowPreview(false)}
              disabled={postTweet.isPending}
              className="btn-secondary px-4 py-2"
            >
              Edit
            </button>
            <button
              onClick={handleSubmit}
              disabled={postTweet.isPending}
              className="btn-primary px-4 py-2 flex items-center gap-2 disabled:opacity-50"
            >
              {postTweet.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post Tweet
                </>
              )}
            </button>
          </div>

          {postTweet.isSuccess && (
            <div className="mt-4 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-700 dark:text-green-300">
              <p className="text-sm">✓ Tweet posted successfully!</p>
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
}
