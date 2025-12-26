'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { TweetCard } from '@/components/TweetCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { GlassCard } from '@/components/GlassCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ComposeTweet } from '@/components/ComposeTweet';
import { RateLimitIndicator } from '@/components/RateLimitIndicator';
import { Tweet, TweetResponse } from '@/lib/types';
import { Twitter, Home, Search as SearchIcon, TrendingUp, PenSquare, X } from 'lucide-react';
import Link from 'next/link';

async function searchTweets(query: string, sortBy: string): Promise<TweetResponse> {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&max=20&sortBy=${sortBy}`);
  if (!response.ok) {
    throw new Error('Failed to search tweets');
  }
  return response.json();
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('javascript OR typescript');
  const [sortBy, setSortBy] = useState('latest');
  const [showCompose, setShowCompose] = useState(false);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery, sortBy],
    queryFn: () => searchTweets(searchQuery, sortBy),
    enabled: searchQuery.length > 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchQuery(query.trim());
    }
  };

  const tweets: Tweet[] = data?.data?.map((tweet) => ({
    ...tweet,
    author: data.includes?.users?.find((user) => user.id === tweet.author_id),
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-twitter-blue/10 via-purple-500/10 to-pink-500/10 dark:from-twitter-blue/5 dark:via-purple-500/5 dark:to-pink-500/5">
      <header className="sticky top-0 z-50 glass-card mx-4 mt-4 rounded-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Twitter className="w-8 h-8 text-twitter-blue" />
                <h1 className="text-2xl font-bold hidden sm:block">X-Bot</h1>
              </Link>
              <nav className="flex items-center gap-2">
                <Link href="/" className="p-2 rounded-full hover:bg-muted/20 transition-colors">
                  <Home className="w-5 h-5" />
                </Link>
                <Link href="/feed" className="p-2 rounded-full hover:bg-muted/20 transition-colors">
                  <Twitter className="w-5 h-5" />
                </Link>
              </nav>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="grid gap-6 mb-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium mb-2">Search Tweets</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                        id="search"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., nextjs OR react"
                        className="w-full pl-12 pr-4 py-3 rounded-full glass-card focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                      />
                    </div>
                    <button type="submit" className="btn-primary">Search</button>
                  </div>
                  <p className="text-sm text-muted mt-2">Use OR, AND, NOT for advanced queries</p>
                </div>

                <div>
                  <label htmlFor="sortBy" className="block text-sm font-medium mb-2">Sort By</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { value: 'latest', label: 'Latest' },
                      { value: 'likes', label: '❤️ Most Liked' },
                      { value: 'retweets', label: '🔄 Most Shared' },
                      { value: 'replies', label: '💬 Most Replies' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          sortBy === option.value
                            ? 'bg-twitter-blue text-white'
                            : 'glass-card hover:scale-105'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </GlassCard>
          </div>

          <div className="lg:col-span-1">
            <RateLimitIndicator />
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg font-semibold"
          >
            <PenSquare className="w-5 h-5" />
            Compose New Tweet
          </button>
        </div>

        {isLoading && <LoadingSpinner />}

        {error && (
          <GlassCard className="p-6 text-center">
            <p className="text-red-500">
              {error instanceof Error ? error.message : 'Failed to search tweets'}
            </p>
          </GlassCard>
        )}

        {!isLoading && !error && tweets.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <h2 className="text-2xl font-bold">Search Results</h2>
              <TrendingUp className="w-5 h-5 text-twitter-blue" />
              <span className="text-sm text-muted">({tweets.length})</span>
            </div>
            {tweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))}
          </div>
        )}

        {!isLoading && !error && searchQuery && tweets.length === 0 && (
          <GlassCard className="p-12 text-center">
            <SearchIcon className="w-16 h-16 mx-auto text-muted mb-4" />
            <h3 className="text-xl font-bold mb-2">No results found</h3>
            <p className="text-muted">Try a different search query</p>
          </GlassCard>
        )}

        {!searchQuery && (
          <GlassCard className="p-12 text-center">
            <SearchIcon className="w-16 h-16 mx-auto text-twitter-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">Search for tweets</h3>
            <p className="text-muted">Enter keywords to find relevant tweets</p>
          </GlassCard>
        )}

        {data?.meta?.fallback && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-700 dark:text-yellow-300">
            <p className="text-sm">{data.meta.message}</p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowCompose(!showCompose)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-twitter-blue hover:bg-twitter-blue/90 text-white shadow-2xl hover:scale-110 transition-all duration-200 flex items-center justify-center group"
        aria-label="Compose Tweet"
      >
        {showCompose ? (
          <X className="w-6 h-6" />
        ) : (
          <PenSquare className="w-6 h-6" />
        )}
        <span className="absolute right-full mr-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {showCompose ? 'Close' : 'Compose Tweet'}
        </span>
      </button>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => {
          if (e.target === e.currentTarget) setShowCompose(false);
        }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ComposeTweet onClose={() => setShowCompose(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
