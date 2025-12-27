'use client';

import { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Send, Eye, X, Sparkles, Loader2, RefreshCw, Wand2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMutation as useConvexMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import toast from 'react-hot-toast';
import { getNicheOptions, getSubcategories } from '@/lib/niches';
import { GeminiRateLimitIndicator } from './GeminiRateLimitIndicator';

interface ComposeTweetProps {
  onClose?: () => void;
}

export function ComposeTweet({ onClose }: ComposeTweetProps) {
  const [text, setText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [niche, setNiche] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [guidance, setGuidance] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMetadata, setAiMetadata] = useState<{
    model?: string;
    prompt?: string;
    niche?: string;
    subcategory?: string;
    guidance?: string;
  } | null>(null);

  const queryClient = useQueryClient();
  const addTweetToConvex = useConvexMutation(api.tweets.addTweet);
  const updateTweetStatus = useConvexMutation(api.tweets.updateTweetStatus);

  const nicheOptions = getNicheOptions();
  const subcategories = niche ? getSubcategories(niche) : [];

  const generateTweet = async () => {
    if (!niche || !subcategory) {
      toast.error('Please select a niche and subcategory', { icon: '⚠️' });
      return;
    }

    setIsGenerating(true);

    try {
      // Update rate limit first
      const limitResponse = await fetch('/api/gemini-limits', {
        method: 'POST',
      });

      const limitData = await limitResponse.json();

      if (!limitData.success) {
        toast.error(limitData.error || 'Rate limit exceeded', { icon: '⏱️' });
        return;
      }

      // Generate tweet
      const response = await fetch('/api/generate-tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche,
          subcategory,
          guidance: guidance.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate tweet');
      }

      const data = await response.json();

      setText(data.tweet);
      setAiMetadata({
        model: 'gemini-2.5-flash',
        prompt: data.prompt,
        niche: data.metadata.niche,
        subcategory: data.metadata.subcategory,
        guidance: data.metadata.guidance,
      });

      toast.success('Tweet generated successfully!', { icon: '✨' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(errorMessage, { icon: '❌' });
    } finally {
      setIsGenerating(false);
    }
  };

  const postTweet = useMutation({
    mutationFn: async (tweetText: string) => {
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
        // Add AI metadata if this was AI-generated
        ...(aiMetadata && {
          isAiGenerated: true,
          aiModel: aiMetadata.model,
          niche: aiMetadata.niche,
          subcategory: aiMetadata.subcategory,
          aiGuidance: aiMetadata.guidance,
          aiPrompt: aiMetadata.prompt,
        }),
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

          await updateTweetStatus({
            id: convexId,
            status: 'failed',
            errorMessage: error.error || 'Failed to post tweet',
            errorCode: response.status,
          });

          throw new Error(error.error || 'Failed to post tweet');
        }

        const data = await response.json();

        await updateTweetStatus({
          id: convexId,
          status: 'posted',
          tweetId: data.tweet?.id,
        });

        return { ...data, convexId };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        await updateTweetStatus({
          id: convexId,
          status: 'failed',
          errorMessage,
        });
        throw err;
      }
    },
    onSuccess: () => {
      toast.success('Tweet posted successfully!', {
        icon: '🎉',
        duration: 5000,
      });

      queryClient.invalidateQueries({ queryKey: ['tweets'] });
      setText('');
      setShowPreview(false);
      setUseAI(false);
      setNiche('');
      setSubcategory('');
      setGuidance('');
      setAiMetadata(null);
      if (onClose) onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to post tweet', {
        icon: '❌',
        duration: 6000,
      });
    },
  });

  const handleSubmit = () => {
    if (!text.trim()) {
      toast.error('Please enter some text', { icon: '⚠️' });
      return;
    }

    if (text.length > 280) {
      toast.error(`Tweet is ${text.length - 280} characters too long`, { icon: '⚠️' });
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
    <div className="space-y-4">
      <GlassCard className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg sm:text-xl font-bold">Compose Tweet</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setUseAI(!useAI);
                if (!useAI) {
                  setText('');
                  setAiMetadata(null);
                }
              }}
              className={`px-3 sm:px-4 py-2 rounded-full flex items-center gap-2 transition-all text-sm ${useAI
                ? 'bg-purple-500 text-white'
                : 'glass-card hover:scale-105'
                }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="font-medium">
                {useAI ? 'AI Mode' : 'Manual'}
              </span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {useAI && !showPreview && (
          <div className="mb-4 space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl glass-card border-2 border-purple-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
              <h4 className="font-semibold text-xs sm:text-sm">AI Generation Settings</h4>
            </div>

            {/* Niche Selector */}
            <div>
              <label htmlFor="niche" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Select Niche *
              </label>
              <select
                id="niche"
                value={niche}
                onChange={(e) => {
                  setNiche(e.target.value);
                  setSubcategory('');
                }}
                className="w-full px-3 sm:px-4 py-2 text-sm rounded-lg glass-card focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isGenerating}
              >
                <option value="">Choose a niche...</option>
                {nicheOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Selector */}
            {niche && (
              <div>
                <label htmlFor="subcategory" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                  Select Subcategory *
                </label>
                <select
                  id="subcategory"
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm rounded-lg glass-card focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isGenerating}
                >
                  <option value="">Choose a subcategory...</option>
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Guidance Input */}
            <div>
              <label htmlFor="guidance" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Additional Guidance (Optional)
              </label>
              <textarea
                id="guidance"
                value={guidance}
                onChange={(e) => setGuidance(e.target.value)}
                placeholder="E.g., 'Focus on beginners', 'Include a statistic', 'Make it inspirational'..."
                className="w-full px-3 sm:px-4 py-2 text-sm rounded-lg glass-card focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={2}
                maxLength={500}
                disabled={isGenerating}
              />
              <p className="text-xs text-muted mt-1">{guidance.length}/500 characters</p>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateTweet}
              disabled={!niche || !subcategory || isGenerating}
              className="w-full btn-primary py-2.5 sm:py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className="text-sm sm:text-base">Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Generate Tweet with AI</span>
                </>
              )}
            </button>
          </div>
        )}

        {!showPreview ? (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={useAI ? "Generated tweet will appear here..." : "What's happening?"}
              className={`w-full min-h-[120px] px-4 py-3 rounded-2xl glass-card focus:outline-none resize-none transition-all duration-200 ${isOverLimit
                ? 'ring-2 ring-red-500 focus:ring-red-500'
                : 'focus:ring-2 focus:ring-twitter-blue'
                }`}
              disabled={postTweet.isPending || isGenerating}
              aria-invalid={isOverLimit}
              aria-describedby={isOverLimit ? 'character-error' : undefined}
              readOnly={useAI && !text}
            />

            {aiMetadata && (
              <div className="mt-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
                <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI-generated ({aiMetadata.niche} → {aiMetadata.subcategory})
                </p>
                <button
                  onClick={generateTweet}
                  disabled={isGenerating}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                {/* Placeholder for future features */}
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
                      {aiMetadata && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI
                        </span>
                      )}
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

      {/* Gemini Rate Limit Indicator */}
      {useAI && <GeminiRateLimitIndicator />}
    </div>
  );
}
