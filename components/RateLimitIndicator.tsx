'use client';

import { useQuery } from '@tanstack/react-query';
import { GlassCard } from './GlassCard';
import { Activity, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

interface RateLimitData {
  reads: {
    limit: number;
    remaining: number;
    reset: string;
    used: number;
    percentage: number;
  };
  posts: {
    limit: number;
    remaining: number;
    reset: string;
    used: number;
    percentage: number;
  };
}

async function fetchRateLimits(): Promise<RateLimitData> {
  const response = await fetch('/api/rate-limits');
  if (!response.ok) {
    throw new Error('Failed to fetch rate limits');
  }
  return response.json();
}

export function RateLimitIndicator() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['rate-limits'],
    queryFn: fetchRateLimits,
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider stale after 30s
  });

  if (isLoading || error || !data) return null;

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-500';
    if (percentage >= 70) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-twitter-blue';
  };

  const formatResetTime = (resetTime: string) => {
    const reset = new Date(resetTime);
    const now = new Date();
    const diff = reset.getTime() - now.getTime();
    
    if (diff < 0) return 'Resetting...';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `Resets in ${hours}h ${minutes}m`;
    return `Resets in ${minutes}m`;
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5 text-twitter-blue" />
        <h3 className="font-semibold">API Rate Limits</h3>
      </div>

      <div className="space-y-4">
        {/* Read Requests */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-muted" />
              <span className="text-sm font-medium">Read Requests</span>
            </div>
            <span className={`text-xs font-bold ${getStatusColor(data.reads.percentage)}`}>
              {data.reads.remaining}/{data.reads.limit}
            </span>
          </div>
          
          <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(data.reads.percentage)} transition-all duration-300`}
              style={{ width: `${data.reads.percentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted">{formatResetTime(data.reads.reset)}</span>
            <span className="text-xs text-muted">{data.reads.used} used</span>
          </div>

          {data.reads.percentage >= 80 && (
            <div className="mt-2 flex items-start gap-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                {data.reads.percentage >= 90
                  ? 'Critical: Very few read requests remaining. Using cached data when possible.'
                  : 'Warning: Approaching read limit. Caching active to preserve requests.'}
              </p>
            </div>
          )}
        </div>

        {/* Post Requests */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted" />
              <span className="text-sm font-medium">Post Requests</span>
            </div>
            <span className={`text-xs font-bold ${getStatusColor(data.posts.percentage)}`}>
              {data.posts.remaining}/{data.posts.limit}
            </span>
          </div>
          
          <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
            <div
              className={`h-full ${getBarColor(data.posts.percentage)} transition-all duration-300`}
              style={{ width: `${data.posts.percentage}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted">{formatResetTime(data.posts.reset)}</span>
            <span className="text-xs text-muted">{data.posts.used} used</span>
          </div>

          {data.posts.percentage >= 80 && (
            <div className="mt-2 flex items-start gap-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                {data.posts.percentage >= 90
                  ? 'Critical: Very few posts remaining this month.'
                  : 'Warning: Approaching monthly post limit.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
