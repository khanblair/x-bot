'use client';

import { useState } from 'react';
import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { GlassCard } from '@/components/GlassCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ComposeTweet } from '@/components/ComposeTweet';
import { RateLimitIndicator } from '@/components/RateLimitIndicator';
import { Twitter, Home, Search as SearchIcon, TrendingUp, PenSquare, X, CheckCircle2, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function FeedPage() {
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [showCompose, setShowCompose] = useState(false);

  // Fetch all posts from Convex
  const allPosts = useConvexQuery(api.tweets.getTweets, { limit: 100 });

  // Filter posts in real-time based on search
  const filteredPosts = allPosts?.filter((tweet) => 
    searchFilter.trim() === '' || 
    tweet.text.toLowerCase().includes(searchFilter.toLowerCase())
  ) || [];

  const visiblePosts = filteredPosts
    .slice()
    .sort((a, b) => {
      if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
      if (sortBy === 'retweets') return (b.retweets || 0) - (a.retweets || 0);
      if (sortBy === 'replies') return (b.replies || 0) - (a.replies || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchFilter(e.target.value);
  };

  const isLoading = allPosts === undefined;

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    if (status === 'posted') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-700 dark:text-green-300">
          <CheckCircle2 className="w-3 h-3" />
          Posted
        </span>
      );
    }
    
    if (status === 'failed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-700 dark:text-red-300">
          <XCircle className="w-3 h-3" />
          Failed
        </span>
      );
    }
    
    if (status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }
  };

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
                <Link href="/search" className="p-2 rounded-full hover:bg-muted/20 transition-colors">
                  <SearchIcon className="w-5 h-5" />
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
              <div className="space-y-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium mb-2">Search Your Posts</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                        id="search"
                        type="text"
                        value={searchFilter}
                        onChange={handleSearchChange}
                        placeholder="Search through your posts..."
                        className="w-full pl-12 pr-4 py-3 rounded-full glass-card focus:outline-none focus:ring-2 focus:ring-twitter-blue"
                      />
                    </div>
                    {searchFilter && (
                      <button
                        type="button"
                        onClick={() => setSearchFilter('')}
                        className="btn-secondary p-3"
                        aria-label="Clear search"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-muted mt-2">
                    {searchFilter ? `Filtering ${visiblePosts.length} of ${allPosts?.length || 0} posts` : `Showing all ${allPosts?.length || 0} posts`}
                  </p>
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
                        type="button"
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
              </div>
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

        {!isLoading && visiblePosts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <h2 className="text-2xl font-bold">
                {searchFilter ? 'Search Results' : 'Your Posts'}
              </h2>
              <TrendingUp className="w-5 h-5 text-twitter-blue" />
              <span className="text-sm text-muted">({visiblePosts.length})</span>
            </div>
            {visiblePosts.map((tweet) => (
              <GlassCard key={tweet._id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-twitter-blue to-purple-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{tweet.authorName || 'You'}</span>
                        <span className="text-muted text-sm">@{tweet.authorUsername || 'user'}</span>
                        {getStatusBadge(tweet.status)}
                      </div>
                      <span className="text-xs text-muted">
                        {new Date(tweet.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap break-words mb-3">{tweet.text}</p>
                    {tweet.status === 'failed' && tweet.errorMessage && (
                      <div className="mt-2 p-2 rounded bg-red-500/10 border border-red-500/20">
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Error: {tweet.errorMessage}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-muted text-sm">
                      <span>❤️ {tweet.likes || 0}</span>
                      <span>🔄 {tweet.retweets || 0}</span>
                      <span>💬 {tweet.replies || 0}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {!isLoading && visiblePosts.length === 0 && allPosts && allPosts.length > 0 && (
          <GlassCard className="p-12 text-center">
            <SearchIcon className="w-16 h-16 mx-auto text-muted mb-4" />
            <h3 className="text-xl font-bold mb-2">No matching posts found</h3>
            <p className="text-muted">Try a different search term</p>
            <button 
              onClick={() => setSearchFilter('')}
              className="btn-primary mt-4"
            >
              Clear Search
            </button>
          </GlassCard>
        )}

        {!isLoading && (!allPosts || allPosts.length === 0) && (
          <GlassCard className="p-12 text-center">
            <Twitter className="w-16 h-16 mx-auto text-muted mb-4" />
            <h3 className="text-xl font-bold mb-2">No posts yet</h3>
            <p className="text-muted">Compose your first tweet to get started!</p>
          </GlassCard>
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
