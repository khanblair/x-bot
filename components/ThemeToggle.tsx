'use client';

import { useTheme } from '@/lib/theme-context';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="glass-card p-3 rounded-full hover:scale-110 transition-all duration-300 group"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-twitter-blue group-hover:rotate-12 transition-transform" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform" />
      )}
    </button>
  );
}
