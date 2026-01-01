'use client';

import { useState, useEffect } from 'react';
import { Clock, Bot, FileText } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function AutoTweetTimer() {
  const [postTime, setPostTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [draftTime, setDraftTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [nextPostLocal, setNextPostLocal] = useState<string>("");
  const [nextDraftLocal, setNextDraftLocal] = useState<string>("");
  const [nextDraftEST, setNextDraftEST] = useState<string>("");
  const [strategyLabel, setStrategyLabel] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      // Target post times in UTC (EST Schedule - 9x Daily):
      // Morning: 9:00, 9:30, 10:00 EST -> 14:00, 14:30, 15:00 UTC
      // Afternoon: 1:00, 1:30, 2:00 EST -> 18:00, 18:30, 19:00 UTC
      // Evening: 5:00, 6:00, 6:30 EST -> 22:00, 23:00, 23:30 UTC
      const scheduleSlotsUTC = [
        { h: 14, m: 0, label: "Target: US Workday (Morning Poll)" },
        { h: 14, m: 30, label: "Target: US Morning (Growth & Reach)" },
        { h: 15, m: 0, label: "Target: US Workday (Morning Poll)" },
        { h: 18, m: 0, label: "Target: Global Spot (Afternoon Hook)" },
        { h: 18, m: 30, label: "Target: Global Spot (Growth & Reach)" },
        { h: 19, m: 0, label: "Target: Global Spot (Afternoon Hook)" },
        { h: 22, m: 0, label: "Target: US End of Day (Evening Value)" },
        { h: 23, m: 0, label: "Target: US End of Day (Evening Value)" },
        { h: 23, m: 30, label: "Target: US Evening (Growth & Reach)" }
      ];

      // Find next scheduled post
      let nextPostDate = null;
      let nextLabel = "";

      for (const slot of scheduleSlotsUTC) {
        const target = new Date(now);
        target.setUTCHours(slot.h, slot.m, 0, 0);

        if (target.getTime() > now.getTime()) {
          nextPostDate = target;
          nextLabel = slot.label;
          break;
        }
      }

      // If no post left today, get first post of tomorrow
      if (!nextPostDate) {
        nextPostDate = new Date(now);
        nextPostDate.setUTCDate(now.getUTCDate() + 1);
        nextPostDate.setUTCHours(scheduleSlotsUTC[0].h, scheduleSlotsUTC[0].m, 0, 0);
        nextLabel = scheduleSlotsUTC[0].label;
      }

      // Update next post local time string
      setNextPostLocal(nextPostDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      // Set strategy label
      setStrategyLabel(nextLabel);

      const msUntilPost = nextPostDate.getTime() - now.getTime();
      const secondsUntilPost = Math.floor(msUntilPost / 1000);

      setPostTime({
        hours: Math.floor(secondsUntilPost / 3600),
        minutes: Math.floor((secondsUntilPost % 3600) / 60),
        seconds: secondsUntilPost % 60,
      });

      // So time until draft = time until post - 1 hour (3600 seconds)
      // If time until post is < 1 hour, draft already happened (or is happening), so show 0 or wait for next cycle?
      // Actually, if we are within the hour before posting, the draft *should* exist.
      // Let's just say countdown to NEXT draft.

      // Draft Generation: Every 2 hours at odd hours (1, 3, 5, ..., 23)
      const draftScheduleUTC = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23];
      let nextDraft = null;
      for (const h of draftScheduleUTC) {
        const target = new Date(now);
        target.setUTCHours(h, 0, 0, 0);
        if (target.getTime() > now.getTime()) {
          nextDraft = target;
          break;
        }
      }

      if (!nextDraft) {
        nextDraft = new Date(now);
        nextDraft.setUTCDate(now.getUTCDate() + 1);
        nextDraft.setUTCHours(draftScheduleUTC[0], 0, 0, 0);
      }

      setNextDraftLocal(nextDraft.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setNextDraftEST(nextDraft.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }));

      const msUntilDraft = nextDraft.getTime() - now.getTime();
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
                <div className="flex flex-col">
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="text-lg md:text-xl font-mono font-bold text-blue-600 dark:text-blue-400">
                      {formatTime(draftTime.hours)}:{formatTime(draftTime.minutes)}:{formatTime(draftTime.seconds)}
                    </div>
                    <span className="text-[10px] md:text-xs text-muted">Daily Cycle</span>
                  </div>

                  {nextDraftLocal && (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-medium text-blue-600/80 dark:text-blue-400/80">
                        Target: {nextDraftEST}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Local: {nextDraftLocal}
                      </span>
                    </div>
                  )}
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
