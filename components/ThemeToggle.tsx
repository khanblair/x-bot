'use client';

import { useTheme } from '@/lib/theme-context';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className="glass-card p-3 rounded-full hover:scale-110 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-twitter-blue focus:ring-offset-2"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-pressed={theme === 'dark'}
      role="switch"
    >
      <div className="relative w-5 h-5">
        <Moon
          className={`absolute inset-0 text-twitter-blue group-hover:rotate-12 transition-all duration-300 ${theme === 'light' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
        />
        <Sun
          className={`absolute inset-0 text-yellow-400 group-hover:rotate-12 transition-all duration-300 ${theme === 'dark' ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
        />
      </div>
    </button>
  );
}
