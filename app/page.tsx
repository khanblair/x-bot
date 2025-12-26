'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Twitter, Zap, Shield, Smartphone, PenSquare, X } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ComposeTweet } from '@/components/ComposeTweet';

export default function Home() {
  const [showCompose, setShowCompose] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-twitter-blue/10 via-purple-500/10 to-pink-500/10 dark:from-twitter-blue/5 dark:via-purple-500/5 dark:to-pink-500/5">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 rounded-2xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Twitter className="w-8 h-8 text-twitter-blue" />
              <h1 className="text-2xl font-bold">X-Bot</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

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
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ComposeTweet onClose={() => setShowCompose(false)} />
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Animated Icon */}
          <div className="animate-float">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-twitter-blue to-purple-500 flex items-center justify-center">
              <Twitter className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4 max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-twitter-blue via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              Your Personal X Feed
            </h2>
            <p className="text-xl md:text-2xl text-muted">
              Fetch, cache, and share tweets with a beautiful interface. 
              Works offline and installs as a PWA.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/feed" className="btn-primary">
              Explore Feed
            </Link>
            <Link href="/search" className="btn-secondary">
              Search Tweets
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 w-full">
            <GlassCard hover className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-twitter-blue/20 flex items-center justify-center">
                <Zap className="w-6 h-6 text-twitter-blue" />
              </div>
              <h3 className="text-xl font-bold">Lightning Fast</h3>
              <p className="text-muted">
                Optimized performance with React Query caching and Next.js 15
              </p>
            </GlassCard>

            <GlassCard hover className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold">Offline Ready</h3>
              <p className="text-muted">
                Service worker caches tweets for seamless offline browsing
              </p>
            </GlassCard>

            <GlassCard hover className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-pink-500" />
              </div>
              <h3 className="text-xl font-bold">PWA Support</h3>
              <p className="text-muted">
                Install on your phone or desktop for app-like experience
              </p>
            </GlassCard>

            <GlassCard hover className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Twitter className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold">Real X API</h3>
              <p className="text-muted">
                Powered by official Twitter API v2 for authentic content
              </p>
            </GlassCard>
          </div>

          {/* Footer */}
          <footer className="mt-20 text-center text-muted">
            <p>Built with Next.js 15, TypeScript, and Twitter API v2</p>
          </footer>
        </div>
      </main>
    </div>
  );
}