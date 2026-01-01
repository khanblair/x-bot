'use client';

import { useState } from 'react';
import { useQuery as useConvexQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { GlassCard } from '@/components/GlassCard';
import { RateLimitIndicator } from '@/components/RateLimitIndicator';
import { PageLayout } from '@/components/PageLayout';
import { Twitter, Search as SearchIcon, TrendingUp, Filter, X, CheckCircle2, XCircle, Clock, Heart, MessageCircle, Repeat2, Sparkles, Trash2, Edit2, AlertTriangle, Save } from 'lucide-react';
import { useMutation } from 'convex/react';

export default function FeedPage() {
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [statusFilter, setStatusFilter] = useState('all');

  // State for Modals
  const [editingTweet, setEditingTweet] = useState<any>(null);
  const [deletingTweetId, setDeletingTweetId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Mutations
  const updateTweetText = useMutation(api.tweets.updateTweetText);
  const deleteTweet = useMutation(api.tweets.deleteTweet);

  const handleEditClick = (tweet: any) => {
    setEditingTweet(tweet);
    setEditText(tweet.text);
  };

  const handleUpdateTweet = async () => {
    if (!editingTweet || !editText.trim()) return;

    try {
      await updateTweetText({ id: editingTweet._id, text: editText });
      setEditingTweet(null);
      setEditText('');
    } catch (error) {
      console.error("Failed to update tweet:", error);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingTweetId(id);
  };

  const CONFIRM_DELETE_TWEET = async () => {
    if (!deletingTweetId) return;
    try {
      await deleteTweet({ id: deletingTweetId as any }); // Cast as any if id type mismatch from raw data
      setDeletingTweetId(null);
    } catch (error) {
      console.error("Failed to delete tweet:", error);
    }
  };

  // Fetch all posts from Convex
  const allPosts = useConvexQuery(api.tweets.getTweets, { limit: 100 });

  // Filter posts in real-time based on search and status
  const filteredPosts = allPosts?.filter((tweet) => {
    const matchesSearch = searchFilter.trim() === '' ||
      tweet.text.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tweet.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const visiblePosts = filteredPosts
    .slice()
    .sort((a, b) => {
      if (sortBy === 'likes') return (b.likes || 0) - (a.likes || 0);
      if (sortBy === 'retweets') return (b.retweets || 0) - (a.retweets || 0);
      if (sortBy === 'replies') return (b.replies || 0) - (a.replies || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

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

  return (
    <PageLayout showNavigation={true} currentPage="feed" showComposeFAB={true}>
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-7xl">
        {/* Header Stats */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <Twitter className="w-8 h-8 text-twitter-blue" />
            Your Feed
          </h1>
          <p className="text-muted">Manage and view all your tweets in one place</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search & Filters Card */}
            <GlassCard className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div>
                  <label htmlFor="search" className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <SearchIcon className="w-4 h-4" />
                    Search Posts
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                      <input
                        id="search"
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="Search through your posts..."
                        className="w-full pl-12 pr-4 py-3 rounded-full glass-card focus:outline-none focus:ring-2 focus:ring-twitter-blue transition-all"
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

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Sort By
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { value: 'latest', label: 'Latest', icon: Clock },
                      { value: 'likes', label: 'Most Liked', icon: Heart },
                      { value: 'retweets', label: 'Most Shared', icon: Repeat2 },
                      { value: 'replies', label: 'Most Replies', icon: MessageCircle },
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSortBy(option.value)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${sortBy === option.value
                            ? 'bg-twitter-blue text-white'
                            : 'glass-card hover:scale-105'
                            }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="hidden sm:inline">{option.label}</span>
                        </button>
                      );
                    })}
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
                  {searchFilter || statusFilter !== 'all'
                    ? `Showing ${visiblePosts.length} of ${allPosts?.length || 0} posts`
                    : `${allPosts?.length || 0} total posts`}
                </p>
              </div>
            </GlassCard>

            {/* Posts List */}
            {isLoading && <LoadingSpinner />}

            {!isLoading && visiblePosts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                  <h2 className="text-2xl font-bold">
                    {searchFilter ? 'Search Results' : statusFilter !== 'all' ? `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Posts` : 'All Posts'}
                  </h2>
                  <span className="text-sm text-muted">({visiblePosts.length})</span>
                </div>
                {visiblePosts.map((tweet) => (
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
                        <p className="whitespace-pre-wrap break-words mb-3 leading-relaxed">{tweet.text}</p>
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

                        {/* Actions for Pending/Drafts only, or allow deleting failed too */}
                        {(tweet.status === 'pending' || tweet.status === 'failed') && (
                          <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-white/5">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEditClick(tweet); }}
                              className="p-2 rounded-full hover:bg-blue-500/10 text-blue-400 transition-colors"
                              title="Edit Draft"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteClick(tweet._id); }}
                              className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors"
                              title="Delete Draft"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
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
                <p className="text-muted mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchFilter('');
                    setStatusFilter('all');
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <RateLimitIndicator />

            {/* Quick Stats */}
            <GlassCard className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-twitter-blue" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted">Total Posts</span>
                  <span className="font-bold text-lg">{allPosts?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Posted
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">{statusCounts.posted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted flex items-center gap-1">
                    <Clock className="w-4 h-4 text-yellow-500" />
                    Pending
                  </span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-400">{statusCounts.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Failed
                  </span>
                  <span className="font-bold text-red-600 dark:text-red-400">{statusCounts.failed}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </main>
    {/* Edit Modal */}
    {editingTweet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <GlassCard className="w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Edit2 className="w-5 h-5 text-blue-400" />
                        Edit Tweet
                    </h3>
                    <button onClick={() => setEditingTweet(null)} className="text-muted hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full h-40 bg-black/20 text-white p-4 rounded-xl border border-white/10 focus:ring-2 focus:ring-twitter-blue outline-none resize-none mb-4"
                    placeholder="Edit your tweet content..."
                />
                
                <div className="flex justify-between items-center text-sm text-muted mb-4">
                    <span>{editText.length} characters</span>
                    {editText.length > 280 && <span className="text-red-500">Over limit!</span>}
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={() => setEditingTweet(null)}
                        className="btn-secondary px-5"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleUpdateTweet}
                        disabled={editText.length > 280 || !editText.trim()}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </GlassCard>
        </div>
    )}

    {/* Delete Confirmation Modal */}
    {deletingTweetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <GlassCard className="w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200 border-red-500/30">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Delete Draft?</h3>
                    <p className="text-muted mb-6">
                        Are you sure you want to delete this draft? This action cannot be undone.
                    </p>
                    
                    <div className="flex justify-center gap-3">
                        <button 
                            onClick={() => setDeletingTweetId(null)}
                            className="btn-secondary w-full"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={CONFIRM_DELETE_TWEET}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-colors w-full font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </GlassCard>
        </div>
    )}
    </PageLayout>
  );
}
