'use client';

import { useState } from 'react';
import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { GlassCard } from '@/components/GlassCard';
import { RateLimitIndicator } from '@/components/RateLimitIndicator';
import { PageLayout } from '@/components/PageLayout';
import { Search as SearchIcon, TrendingUp, Sparkles, X, CheckCircle2, XCircle, Clock, Heart, MessageCircle, Repeat2, Filter } from 'lucide-react';

export default function SearchPage() {
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch all posts from Convex by default
  const allPosts = useConvexQuery(api.tweets.getTweets, { limit: 100 });

  // Filter in real-time as user types
  const filteredPosts = allPosts?.filter((tweet) => {
    const matchesSearch = searchFilter.trim() === '' ||
      tweet.text.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tweet.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const isLoading = allPosts === undefined;

  const getStatusBadge = (status?: string, isAiGenerated?: boolean) => {
    if (!status) return null;

    if (status === 'pending' && isAiGenerated) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
          <Sparkles className="w-3 h-3" />
          AI Draft
        </span>
      );
    }

    const badges = {
      posted: { icon: CheckCircle2, text: 'Posted', color: 'bg-green-500/20 text-green-700 dark:text-green-300' },
      failed: { icon: XCircle, text: 'Failed', color: 'bg-red-500/20 text-red-700 dark:text-red-300' },
      pending: { icon: Clock, text: 'Pending', color: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' },
    };

    const badge = badges[status as keyof typeof badges];
    if (!badge) return null;

    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  const statusCounts = {
    all: allPosts?.length || 0,
    posted: allPosts?.filter(t => t.status === 'posted').length || 0,
    pending: allPosts?.filter(t => t.status === 'pending').length || 0,
    failed: allPosts?.filter(t => t.status === 'failed').length || 0,
  };

  // Get trending keywords (most common words in tweets)
  const getTrendingKeywords = () => {
    if (!allPosts || allPosts.length === 0) return [];

    const wordCounts: Record<string, number> = {};
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);

    allPosts.forEach(tweet => {
      const words: string[] = tweet.text.toLowerCase().match(/\b\w+\b/g) || [];
      words.forEach(word => {
        if (word.length > 3 && !stopWords.has(word)) {
          wordCounts[word] = (wordCounts[word] || 0) + 1;
        }
      });
    });

    return Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word, count]) => ({ word, count }));
  };

  const trendingKeywords = getTrendingKeywords();

  return (
    <PageLayout showNavigation={true} currentPage="search" showComposeFAB={true}>
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <SearchIcon className="w-8 h-8 text-twitter-blue" />
            Search Posts
          </h1>
          <p className="text-muted">Find exactly what you're looking for</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search Card */}
            <GlassCard className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <SearchIcon className="w-4 h-4" />
                    Search Query
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                        id="search"
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Type to search..."
                        className="w-full pl-12 pr-4 py-3 rounded-full glass-card focus:outline-none focus:ring-2 focus:ring-twitter-blue transition-all"
                        autoFocus
                      />
                    </div>
                    {searchFilter && (
                      <button
                        type="button"
                        onClick={() => setSearchFilter('')}
                        className="btn-secondary p-3 rounded-full"
                        aria-label="Clear search"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter by Status
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { value: 'all', label: 'All', count: statusCounts.all },
                      { value: 'posted', label: 'Posted', count: statusCounts.posted },
                      { value: 'pending', label: 'Pending', count: statusCounts.pending },
                      { value: 'failed', label: 'Failed', count: statusCounts.failed },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setStatusFilter(option.value)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${statusFilter === option.value
                          ? 'bg-twitter-blue text-white'
                          : 'glass-card hover:scale-105'
                          }`}
                      >
                        {option.label} ({option.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Count */}
                <p className="text-sm text-muted text-center pt-2 border-t border-muted/20">
                  {searchFilter
                    ? `Found ${filteredPosts.length} matching post${filteredPosts.length !== 1 ? 's' : ''}`
                    : `${allPosts?.length || 0} total posts available`}
                </p>
              </div>
            </GlassCard>

            {/* Search Results */}
            {isLoading && <LoadingSpinner />}

            {!isLoading && filteredPosts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <h2 className="text-2xl font-bold">
                    {searchFilter ? 'Search Results' : statusFilter !== 'all' ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Posts` : 'All Posts'}
                  </h2>
                  <span className="text-sm text-muted">({filteredPosts.length})</span>
                </div>
                {filteredPosts.map((tweet) => (
                  <GlassCard key={tweet._id} className="p-5 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-twitter-blue to-purple-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{tweet.authorName || 'You'}</span>
                            <span className="text-muted text-sm">@{tweet.authorUsername || 'user'}</span>
                            {getStatusBadge(tweet.status, tweet.isAiGenerated)}
                          </div>
                          <span className="text-xs text-muted">
                            {new Date(tweet.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap break-words mb-3 leading-relaxed">
                          {searchFilter ? (
                            // Highlight search term
                            tweet.text.split(new RegExp(`(${searchFilter})`, 'gi')).map((part, i) =>
                              part.toLowerCase() === searchFilter.toLowerCase() ? (
                                <mark key={i} className="bg-yellow-200 dark:bg-yellow-900 px-1 rounded">{part}</mark>
                              ) : part
                            )
                          ) : tweet.text}
                        </p>
                        {tweet.status === 'failed' && tweet.errorMessage && (
                          <div className="mt-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                              <XCircle className="w-4 h-4" />
                              Error: {tweet.errorMessage}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-6 text-muted text-sm mt-3">
                          <span className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
                            {tweet.likes || 0}
                          </span>
                          <span className="flex items-center gap-1 hover:text-green-500 transition-colors">
                            <Repeat2 className="w-4 h-4" />
                            {tweet.retweets || 0}
                          </span>
                          <span className="flex items-center gap-1 hover:text-twitter-blue transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            {tweet.replies || 0}
                          </span>
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
                <p className="text-muted mb-4">Try different keywords or clear your filters</p>
                <button
                  onClick={() => {
                    setSearchFilter('');
                    setStatusFilter('all');
                  }}
                  className="btn-primary"
                >
                  Clear Search
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <RateLimitIndicator />

            {/* Trending Keywords */}
            {trendingKeywords.length > 0 && (
              <GlassCard className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-twitter-blue" />
                  Trending in Your Posts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingKeywords.map(({ word, count }) => (
                    <button
                      key={word}
                      onClick={() => setSearchFilter(word)}
                      className="px-3 py-1.5 rounded-full glass-card hover:bg-twitter-blue hover:text-white transition-all text-sm font-medium flex items-center gap-2"
                    >
                      #{word}
                      <span className="text-xs opacity-70">({count})</span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Search Tips */}
            <GlassCard className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-twitter-blue" />
                Search Tips
              </h3>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-twitter-blue mt-0.5">•</span>
                  <span>Search is case-insensitive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-twitter-blue mt-0.5">•</span>
                  <span>Results update as you type</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-twitter-blue mt-0.5">•</span>
                  <span>Click trending keywords for quick search</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-twitter-blue mt-0.5">•</span>
                  <span>Combine filters for precise results</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
