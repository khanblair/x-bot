'use client';

import { useState, useEffect } from 'react';
import { Clock, Bot } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function AutoTweetTimer() {
  const [timeRemaining, setTimeRemaining] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // Calculate minutes since last 2-hour interval
      const minutesSinceLastRun = (currentHour % 2) * 60 + currentMinute;
      const minutesUntilNextRun = 120 - minutesSinceLastRun;

      // If it's exactly at the interval, show 2 hours
      const adjustedMinutes = minutesUntilNextRun === 0 ? 120 : minutesUntilNextRun;

      const hours = Math.floor(adjustedMinutes / 60);
      const minutes = adjustedMinutes % 60;
      const seconds = 59 - currentSecond; // Count down to next minute

      setTimeRemaining({ hours, minutes, seconds });
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every second
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="fixed bottom-32 md:bottom-36 right-6 md:right-8 z-50">
      <div className="relative">
        {/* Expanded Timer Display */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 mb-2">
            <GlassCard className="p-3 md:p-4 min-w-[160px] md:min-w-[180px] lg:min-w-[200px] shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                <span className="text-xs md:text-sm font-medium">Next Auto-Tweet</span>
              </div>
              <div className="text-center">
                <div className="text-lg md:text-xl lg:text-2xl font-mono font-bold text-purple-600 dark:text-purple-400">
                  {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}
                </div>
                <div className="text-[10px] md:text-xs text-muted mt-1">
                  {timeRemaining.hours > 0 ? `${timeRemaining.hours}h ${timeRemaining.minutes}m` : `${timeRemaining.minutes}m ${timeRemaining.seconds}s`} remaining
                </div>
              </div>
              <div className="mt-2 text-[10px] md:text-xs text-muted text-center">
                Runs every 2 hours
              </div>
            </GlassCard>
          </div>
        )}

        {/* Floating Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center group border-2 border-white/20"
          aria-label="Auto-tweet timer"
        >
          <Clock className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-purple-100 transition-colors" />
          {/* Show countdown on button when collapsed */}
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] md:text-xs rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center font-bold">
            {timeRemaining.hours > 0 ? timeRemaining.hours : timeRemaining.minutes}
          </div>
        </button>

        {/* Pulse Animation when close to time */}
        {timeRemaining.hours === 0 && timeRemaining.minutes <= 30 && (
          <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
        )}
      </div>
    </div>
  );
}
