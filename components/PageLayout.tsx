'use client';

import { ReactNode, useState } from 'react';
import { PenSquare, X } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ComposeTweet } from '@/components/ComposeTweet';

interface PageLayoutProps {
  children: ReactNode;
  showNavigation?: boolean;
  currentPage?: 'home' | 'feed' | 'search' | 'notifications' | 'settings';
  showComposeFAB?: boolean;
  showFooter?: boolean;
  className?: string;
}

export function PageLayout({
  children,
  showNavigation = false,
  currentPage,
  showComposeFAB = false,
  showFooter = false,
  className = ""
}: PageLayoutProps) {
  const [showCompose, setShowCompose] = useState(false);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-twitter-blue/10 via-purple-500/10 to-pink-500/10 dark:from-twitter-blue/5 dark:via-purple-500/5 dark:to-pink-500/5 transition-colors duration-300 ${className}`}>
      <Header showNavigation={showNavigation} currentPage={currentPage} />

      {children}

      {showFooter && <Footer />}

      {/* Floating Action Button */}
      {showComposeFAB && (
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full bg-twitter-blue hover:bg-twitter-blue/90 text-white shadow-2xl hover:scale-110 transition-all duration-200 flex items-center justify-center group"
          aria-label={showCompose ? "Close compose" : "Compose Tweet"}
        >
          {showCompose ? (
            <X className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <PenSquare className="w-5 h-5 md:w-6 md:h-6" />
          )}
          <span className="absolute right-full mr-3 md:mr-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {showCompose ? 'Close' : 'Compose Tweet'}
          </span>
        </button>
      )}

      {/* Compose Modal */}
      {showCompose && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCompose(false);
          }}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ComposeTweet onClose={() => setShowCompose(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
