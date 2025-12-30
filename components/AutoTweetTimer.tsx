'use client';

import { useState, useEffect } from 'react';
import { Clock, Bot, FileText } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function AutoTweetTimer() {
  const [postTime, setPostTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [draftTime, setDraftTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [nextPostLocal, setNextPostLocal] = useState<string>("");
  const [strategyLabel, setStrategyLabel] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      // Target post times in UTC (EST Schedule):
      // 9 AM EST = 14:00 UTC
      // 1 PM EST = 18:00 UTC
      // 5 PM EST = 22:00 UTC
      const scheduleHoursUTC = [14, 18, 22];

      // Find next scheduled post
      let nextPost = null;
      for (const h of scheduleHoursUTC) {
        const target = new Date(now);
        target.setUTCHours(h, 0, 0, 0);

        if (target.getTime() > now.getTime()) {
          nextPost = target;
          break;
        }
      }

      // If no post left today, get first post of tomorrow
      if (!nextPost) {
        nextPost = new Date(now);
        nextPost.setUTCDate(now.getUTCDate() + 1);
        nextPost.setUTCHours(scheduleHoursUTC[0], 0, 0, 0);
      }

      // Update next post local time string
      setNextPostLocal(nextPost.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Set strategy label based on UTC hour
      const utcHour = nextPost.getUTCHours();
      if (utcHour === 14) setStrategyLabel("Target: US Workday Start (9 AM EST)");
      else if (utcHour === 18) setStrategyLabel("Target: Global Sweet Spot (1 PM EST)");
      else setStrategyLabel("Target: US End of Day (5 PM EST)");

      const msUntilPost = nextPost.getTime() - now.getTime();
      const secondsUntilPost = Math.floor(msUntilPost / 1000);

      setPostTime({
        hours: Math.floor(secondsUntilPost / 3600),
        minutes: Math.floor((secondsUntilPost % 3600) / 60),
        seconds: secondsUntilPost % 60,
      });

      // Draft is generated 1 hour before post
      // So time until draft = time until post - 1 hour (3600 seconds)
      // If time until post is < 1 hour, draft already happened (or is happening), so show 0 or wait for next cycle?
      // Actually, if we are within the hour before posting, the draft *should* exist.
      // Let's just say countdown to NEXT draft.

      // Draft is generated 1 hour before post
      // So time until draft = time until post - 1 hour (3600 seconds)
      let msUntilDraft = msUntilPost - 3600 * 1000;

      // If draft time for the upcoming post has already passed (we are in the 1h window before post),
      // we should show the countdown to the START of the *next* cycle's draft.
      if (msUntilDraft < 0) {
        // Find the post *after* nextPost
        let followingPost = null;
        const currentNextPostHour = nextPost.getUTCHours();

        for (const h of scheduleHoursUTC) {
          const potentialPost = new Date(nextPost);
          potentialPost.setUTCHours(h, 0, 0, 0);
          // If this slot is later today than the current nextPost
          if (potentialPost.getTime() > nextPost.getTime()) {
            followingPost = potentialPost;
            break;
          }
        }

        if (!followingPost) {
          // Wrap to tomorrow first slot
          followingPost = new Date(nextPost);
          followingPost.setUTCDate(nextPost.getUTCDate() + 1);
          followingPost.setUTCHours(scheduleHoursUTC[0], 0, 0, 0);
        }

        // New draft target is 1 hour before this *following* post
        msUntilDraft = (followingPost.getTime() - 3600 * 1000) - now.getTime();
      }

      const secondsUntilDraft = Math.max(0, Math.floor(msUntilDraft / 1000));

      setDraftTime({
        hours: Math.floor(secondsUntilDraft / 3600),
        minutes: Math.floor((secondsUntilDraft % 3600) / 60),
        seconds: secondsUntilDraft % 60,
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
              {/* Post Timer */}
              <div className="mb-4 pb-3 border-b border-muted/20">
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="w-3 h-3 md:w-4 md:h-4 text-purple-500" />
                  <span className="text-xs md:text-sm font-medium">Next Auto-Post</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="text-lg md:text-xl font-mono font-bold text-purple-600 dark:text-purple-400">
                      {formatTime(postTime.hours)}:{formatTime(postTime.minutes)}:{formatTime(postTime.seconds)}
                    </div>
                    <span className="text-[10px] md:text-xs text-muted">EST Schedule</span>
                  </div>

                  {nextPostLocal && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-medium text-purple-600/80 dark:text-purple-400/80">
                        {strategyLabel}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Local: {nextPostLocal}
                      </span>
                    </div>
                  )}
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
                    {formatTime(draftTime.hours)}:{formatTime(draftTime.minutes)}:{formatTime(draftTime.seconds)}
                  </div>
                  <span className="text-[10px] md:text-xs text-muted">Daily Cycle</span>
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
