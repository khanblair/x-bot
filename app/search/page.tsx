'use client';

import { useState } from 'react';
import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { GlassCard } from '@/components/GlassCard';
import { ComposeTweet } from '@/components/ComposeTweet';
import { RateLimitIndicator } from '@/components/RateLimitIndicator';
import { PageLayout } from '@/components/PageLayout';
import { Twitter, Search as SearchIcon, TrendingUp, PenSquare, X, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function SearchPage() {
  const [searchFilter, setSearchFilter] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  
  // Fetch all posts from Convex by default
  const allPosts = useConvexQuery(api.tweets.getTweets, { limit: 100 });
  
  // Filter in real-time as user types
  const filteredPosts = allPosts?.filter((tweet) => 
    searchFilter.trim() === '' || 
    tweet.text.toLowerCase().includes(searchFilter.toLowerCase())
  ) || [];

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
    <PageLayout showNavigation={true} currentPage="search" showComposeFAB={true}>
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-7xl">
        <div className="grid gap-6 mb-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
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
                        placeholder="Type to search..."
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
                    {searchFilter ? `Found ${filteredPosts.length} matching post${filteredPosts.length !== 1 ? 's' : ''}` : `Showing all ${allPosts?.length || 0} posts`}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-4">
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

        {!isLoading && filteredPosts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <h2 className="text-2xl font-bold">
                {searchFilter ? 'Search Results' : 'All Posts'}
              </h2>
              <TrendingUp className="w-5 h-5 text-twitter-blue" />
              <span className="text-sm text-muted">({filteredPosts.length})</span>
            </div>
            {filteredPosts.map((tweet) => (
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

        {!isLoading && filteredPosts.length === 0 && searchFilter && allPosts && allPosts.length > 0 && (
          <GlassCard className="p-12 text-center">
            <SearchIcon className="w-16 h-16 mx-auto text-muted mb-4" />
            <h3 className="text-xl font-bold mb-2">No matching posts found</h3>
            <p className="text-muted">Try different keywords</p>
            <button 
              onClick={() => setSearchFilter('')}
              className="btn-primary mt-4"
            >
              Show All Posts
            </button>
          </GlassCard>
        )}

        {!isLoading && (!allPosts || allPosts.length === 0) && (
          <GlassCard className="p-12 text-center">
            <SearchIcon className="w-16 h-16 mx-auto text-twitter-blue mb-4" />
            <h3 className="text-xl font-bold mb-2">No posts yet</h3>
            <p className="text-muted">Compose your first tweet to get started!</p>
          </GlassCard>
        )}
      </main>
    </PageLayout>
  );
}
