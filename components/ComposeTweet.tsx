'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Send, Eye, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMutation as useConvexMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import toast from 'react-hot-toast';

interface ComposeTweetProps {
  onClose?: () => void;
}

export function ComposeTweet({ onClose }: ComposeTweetProps) {
  const [text, setText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const queryClient = useQueryClient();
  const addTweetToConvex = useConvexMutation(api.tweets.addTweet);
  const updateTweetStatus = useConvexMutation(api.tweets.updateTweetStatus);

  const postTweet = useMutation({
    mutationFn: async (tweetText: string) => {
      // Validation
      if (!tweetText.trim()) {
        throw new Error('Tweet cannot be empty');
      }

      if (tweetText.length > 280) {
        throw new Error('Tweet exceeds 280 character limit');
      }

      // Add to Convex first with pending status
      const convexId = await addTweetToConvex({
        text: tweetText,
        status: 'pending',
        source: 'compose',
      });

      // Post to Twitter
      try {
        const response = await fetch('/api/post-tweet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: tweetText }),
        });

        if (!response.ok) {
          const error = await response.json();

          // Update Convex with failure
          await updateTweetStatus({
            id: convexId,
            status: 'failed',
            errorMessage: error.error || 'Failed to post tweet',
            errorCode: response.status,
          });

          throw new Error(error.error || 'Failed to post tweet');
        }

        const data = await response.json();

        // Update Convex with success
        await updateTweetStatus({
          id: convexId,
          status: 'posted',
          tweetId: data.tweet?.id,
        });

        return { ...data, convexId };
      } catch (err: any) {
        // Update Convex with failure
        await updateTweetStatus({
          id: convexId,
          status: 'failed',
          errorMessage: err.message,
        });
        throw err;
      }
    },
    onSuccess: () => {
      // Show success toast
      toast.success('Tweet posted successfully!', {
        icon: '🎉',
        duration: 5000,
      });

      // Invalidate queries to refresh feed
      queryClient.invalidateQueries({ queryKey: ['tweets'] });
      setText('');
      setShowPreview(false);
      if (onClose) onClose();
    },
    onError: (error: Error) => {
      // Show error toast
      toast.error(error.message || 'Failed to post tweet', {
        icon: '❌',
        duration: 6000,
      });
    },
  });

  const handleSubmit = () => {
    // Validation with toasts
    if (!text.trim()) {
      toast.error('Please enter some text', {
        icon: '⚠️',
      });
      return;
    }

    if (text.length > 280) {
      toast.error(`Tweet is ${text.length - 280} characters too long`, {
        icon: '⚠️',
      });
      return;
    }

    postTweet.mutate(text);
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
            className={`w-full min-h-[120px] px-4 py-3 rounded-2xl glass-card focus:outline-none resize-none transition-all duration-200 ${isOverLimit
                ? 'ring-2 ring-red-500 focus:ring-red-500'
                : 'focus:ring-2 focus:ring-twitter-blue'
              }`}
            disabled={postTweet.isPending}
            aria-invalid={isOverLimit}
            aria-describedby={isOverLimit ? 'character-error' : undefined}
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
              {/* Character count with progress ring */}
              <div className="relative flex items-center justify-center">
                <svg className="w-8 h-8 transform -rotate-90">
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="text-muted/20"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 14}`}
                    strokeDashoffset={`${2 * Math.PI * 14 * (1 - characterCount / 280)}`}
                    className={`transition-all duration-200 ${characterColor}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`absolute text-xs font-medium ${characterColor}`}>
                  {characterCount > 260 ? 280 - characterCount : ''}
                </span>
              </div>

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
            <p className="text-red-500 text-sm mt-2 flex items-center gap-2" id="character-error" role="alert">
              <span className="font-bold">⚠️</span>
              Tweet is {characterCount - 280} characters over the limit
            </p>
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
        </>
      )}
    </GlassCard>
  );
}
