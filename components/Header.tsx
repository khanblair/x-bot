'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Twitter, Home, Search as SearchIcon, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/lib/theme-context';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

interface HeaderProps {
  showNavigation?: boolean;
  currentPage?: 'home' | 'feed' | 'search' | 'notifications';
}

export function Header({ showNavigation = true, currentPage }: HeaderProps) {
  const { theme } = useTheme();
  const unreadCount = useQuery(api.pushNotifications.getUnreadCount);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 mt-4 rounded-2xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="relative w-8 h-8 transition-opacity duration-300">
                <Image
                  src={theme === 'dark' ? '/icons8-x-60-white.png' : '/icons8-x-60-black.png'}
                  alt="X-Bot Logo"
                  width={32}
                  height={32}
                  className="transition-all duration-300"
                  priority
                />
              </div>
              <h1 className="text-2xl font-bold hidden sm:block">X-Bot</h1>
            </Link>
            {showNavigation && (
              <nav className="flex items-center gap-2 ml-2 border-l border-muted/20 pl-3">
                <Link
                  href="/"
                  className={`p-2 rounded-full transition-colors ${currentPage === 'home'
                    ? 'bg-twitter-blue text-white'
                    : 'hover:bg-muted/20'
                    }`}
                >
                  <Home className="w-5 h-5" />
                </Link>
                <Link
                  href="/feed"
                  className={`p-2 rounded-full transition-colors ${currentPage === 'feed'
                    ? 'bg-twitter-blue text-white'
                    : 'hover:bg-muted/20'
                    }`}
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="/search"
                  className={`p-2 rounded-full transition-colors ${currentPage === 'search'
                    ? 'bg-twitter-blue text-white'
                    : 'hover:bg-muted/20'
                    }`}
                >
                  <SearchIcon className="w-5 h-5" />
                </Link>
                <Link
                  href="/notifications"
                  className={`p-2 rounded-full transition-colors relative ${currentPage === 'notifications'
                    ? 'bg-twitter-blue text-white'
                    : 'hover:bg-muted/20'
                    }`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount !== undefined && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
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