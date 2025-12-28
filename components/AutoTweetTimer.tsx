'use client';

import { useState, useEffect } from 'react';
import { Clock, Bot, FileText } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function AutoTweetTimer() {
  const [postTime, setPostTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [draftTime, setDraftTime] = useState({ minutes: 0, seconds: 0 });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // --- 2-Hour Post Timer ---
      const minutesSinceLastPost = (currentHour % 2) * 60 + currentMinute;
      const minutesUntilPost = 120 - minutesSinceLastPost;
      const adjustedPostMinutes = minutesUntilPost === 0 ? 120 : minutesUntilPost;

      setPostTime({
        hours: Math.floor(adjustedPostMinutes / 60),
        minutes: adjustedPostMinutes % 60,
        seconds: 59 - currentSecond,
      });

      // --- 30-Minute Draft Timer ---
      const minutesSinceLastDraft = currentMinute % 30;
      const minutesUntilDraft = 30 - minutesSinceLastDraft;

      setDraftTime({
        minutes: minutesUntilDraft === 30 ? 30 : minutesUntilDraft - 1, // -1 because we track seconds separately
        seconds: 59 - currentSecond,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="fixed bottom-32 md:bottom-36 right-6 md:right-8 z-50">
      <div className="relative">
        {/* Expanded Timer Display */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 mb-2">
            <GlassCard className="p-3 md:p-4 min-w-[200px] md:min-w-[240px] shadow-lg transition-all duration-300">

              {/* Post Timer */}
              <div className="mb-4 pb-3 border-b border-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                  <span className="text-xs md:text-sm font-medium">Next Auto-Post</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-lg md:text-xl font-mono font-bold text-purple-600 dark:text-purple-400">
                    {formatTime(postTime.hours)}:{formatTime(postTime.minutes)}:{formatTime(postTime.seconds)}
                  </div>
                  <span className="text-[10px] md:text-xs text-muted">2h cycle</span>
                </div>
              </div>

              {/* Draft Timer */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
                  <span className="text-xs md:text-sm font-medium">Next Draft Gen</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-lg md:text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                    00:{formatTime(draftTime.minutes)}:{formatTime(draftTime.seconds)}
                  </div>
                  <span className="text-[10px] md:text-xs text-muted">30m cycle</span>
                </div>
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

          {/* Badge shows Post Hours (if > 0) or Post Minutes */}
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] md:text-xs rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center font-bold">
            {postTime.hours > 0 ? postTime.hours : postTime.minutes}
          </div>
        </button>

        {/* Pulse Animation when close to Post time */}
        {postTime.hours === 0 && postTime.minutes <= 10 && (
          <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
        )}
      </div>
    </div>
  );
}
