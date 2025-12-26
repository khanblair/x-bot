'use client';

import Link from 'next/link';
import { Twitter, Home, Search as SearchIcon } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HeaderProps {
  showNavigation?: boolean;
  currentPage?: 'home' | 'feed' | 'search';
}

export function Header({ showNavigation = true, currentPage }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 rounded-2xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Twitter className="w-8 h-8 text-twitter-blue" />
              <h1 className="text-2xl font-bold hidden sm:block">X-Bot</h1>
            </Link>
            {showNavigation && (
              <nav className="flex items-center gap-2 ml-2 border-l border-muted/20 pl-3">
                <Link 
                  href="/" 
                  className={`p-2 rounded-full transition-colors ${
                    currentPage === 'home' 
                      ? 'bg-twitter-blue text-white' 
                      : 'hover:bg-muted/20'
                  }`}
                >
                  <Home className="w-5 h-5" />
                </Link>
                <Link 
                  href="/feed" 
                  className={`p-2 rounded-full transition-colors ${
                    currentPage === 'feed' 
                      ? 'bg-twitter-blue text-white' 
                      : 'hover:bg-muted/20'
                  }`}
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link 
                  href="/search" 
                  className={`p-2 rounded-full transition-colors ${
                    currentPage === 'search' 
                      ? 'bg-twitter-blue text-white' 
                      : 'hover:bg-muted/20'
                  }`}
                >
                  <SearchIcon className="w-5 h-5" />
                </Link>
              </nav>
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}