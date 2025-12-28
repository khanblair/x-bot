'use client';

import Link from 'next/link';
import { Zap, Shield, Smartphone, Twitter, Sparkles, TrendingUp, Search, Edit3, BarChart3, Clock } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { PageLayout } from '@/components/PageLayout';

export default function Home() {
  return (
    <PageLayout showNavigation={true} currentPage="home" showComposeFAB={true} showFooter={true}>
      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-24 pb-20">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Animated Icon */}
          <div className="animate-float">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-twitter-blue via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
              <img src="/icons8-x-60-white.png" alt="X Logo" className="w-20 h-20 object-contain" />
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-6 max-w-4xl">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-twitter-blue via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              X-Bot
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold">
              AI-Powered Tweet Generation & Management
            </h2>
            <p className="text-xl md:text-2xl text-muted max-w-3xl mx-auto leading-relaxed">
              Create engaging tweets with AI, manage your content, track performance, and grow your presence on X (Twitter) — all in one beautiful, offline-ready PWA.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/feed" className="btn-primary px-8 py-4 text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              View Your Feed
            </Link>
            <Link href="/search" className="btn-secondary px-8 py-4 text-lg flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search Tweets
            </Link>
          </div>

          {/* AI Feature Highlight */}
          <div className="mt-16 w-full max-w-5xl">
            <GlassCard className="p-8 md:p-12 border-2 border-purple-500/30">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    ✨ NEW: AI Tweet Generation
                  </h3>
                  <p className="text-lg text-muted mb-4">
                    Generate professional, engaging tweets in seconds using advanced AI models. Choose from 12 niches, 120+ subcategories, and let AI craft the perfect message with smart hashtags.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium">
                      20-50 words
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium">
                      Smart Hashtags
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium">
                      12 Niches
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium">
                      480+ Hashtags
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Core Features */}
          <div className="mt-20 w-full">
            <h3 className="text-3xl md:text-4xl font-bold mb-12">
              Everything You Need to Succeed on X
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <GlassCard hover className="p-6 space-y-4 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-twitter-blue to-blue-600 flex items-center justify-center">
                  <Edit3 className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold">AI Tweet Composer</h4>
                <p className="text-muted">
                  Generate tweets with AI or write manually. Preview before posting, edit as needed, and track posting status in real-time.
                </p>
              </GlassCard>

              <GlassCard hover className="p-6 space-y-4 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold">Smart Hashtags</h4>
                <p className="text-muted">
                  Automatically adds relevant hashtags based on your niche and content. 480+ curated hashtags across all categories.
                </p>
              </GlassCard>

              <GlassCard hover className="p-6 space-y-4 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold">Performance Tracking</h4>
                <p className="text-muted">
                  Monitor likes, retweets, replies, and engagement. Filter by status (posted, pending, failed) and sort by performance.
                </p>
              </GlassCard>

              <GlassCard hover className="p-6 space-y-4 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold">Advanced Search</h4>
                <p className="text-muted">
                  Search through your tweets, filter by status, and discover trending keywords from your content automatically.
                </p>
              </GlassCard>

              <GlassCard hover className="p-6 space-y-4 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold">Offline Ready</h4>
                <p className="text-muted">
                  Service worker caches your tweets for seamless offline browsing. Continue working even without internet.
                </p>
              </GlassCard>

              <GlassCard hover className="p-6 space-y-4 transition-all duration-300 hover:scale-105">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Smartphone className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-bold">PWA Support</h4>
                <p className="text-muted">
                  Install on your phone or desktop for an app-like experience. Works like a native application.
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Technical Features */}
          <div className="mt-20 w-full">
            <h3 className="text-3xl md:text-4xl font-bold mb-12">
              Built with Modern Technology
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlassCard className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-twitter-blue/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-twitter-blue" />
                </div>
                <h4 className="text-lg font-bold">Lightning Fast</h4>
                <p className="text-sm text-muted">
                  Next.js 16 with Turbopack for instant page loads
                </p>
              </GlassCard>

              <GlassCard className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Twitter className="w-6 h-6 text-purple-500" />
                </div>
                <h4 className="text-lg font-bold">Real X API</h4>
                <p className="text-sm text-muted">
                  Official Twitter API v2 for authentic content
                </p>
              </GlassCard>



              <GlassCard className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-magenta-500" />
                </div>
                <h4 className="text-lg font-bold">AI-Powered</h4>
                <p className="text-sm text-muted">
                  Advanced LLM technology for intelligent tweet generation
                </p>
              </GlassCard>

              <GlassCard className="p-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-500" />
                </div>
                <h4 className="text-lg font-bold">Real-time Sync</h4>
                <p className="text-sm text-muted">
                  Convex database for instant data synchronization
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 w-full max-w-3xl">
            <GlassCard className="p-12 text-center bg-gradient-to-br from-twitter-blue/10 to-purple-500/10 border-2 border-twitter-blue/30">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Elevate Your X Presence?
              </h3>
              <p className="text-lg text-muted mb-8">
                Start creating engaging content with AI assistance today
              </p>
              <Link href="/feed" className="btn-primary px-10 py-4 text-lg inline-flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Get Started Now
              </Link>
            </GlassCard>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}