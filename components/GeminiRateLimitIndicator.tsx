'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import { Sparkles, Clock, AlertCircle } from 'lucide-react';

interface GeminiLimits {
    endpoint: string;
    requestCount: number;
    limit: number;
    resetTime: number;
    remaining: number;
}

export function GeminiRateLimitIndicator() {
    const [limits, setLimits] = useState<GeminiLimits | null>(null);
    const [timeUntilReset, setTimeUntilReset] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const fetchLimits = async () => {
        try {
            const response = await fetch('/api/gemini-limits');
            const data = await response.json();

            if (data.success) {
                setLimits(data.limits);
            }
        } catch (error) {
            console.error('Error fetching Gemini limits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLimits();
        const interval = setInterval(fetchLimits, 10000); // Refresh every 10 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!limits) return;

        const updateTimer = () => {
            const now = Date.now();
            const diff = limits.resetTime - now;

            if (diff <= 0) {
                setTimeUntilReset('Resetting...');
                fetchLimits();
                return;
            }

            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;

            if (minutes > 0) {
                setTimeUntilReset(`${minutes}m ${remainingSeconds}s`);
            } else {
                setTimeUntilReset(`${remainingSeconds}s`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [limits]);

    if (loading) {
        return (
            <GlassCard className="p-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-muted/20 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-muted/20 rounded w-1/2"></div>
                </div>
            </GlassCard>
        );
    }

    if (!limits) return null;

    const percentage = (limits.remaining / limits.limit) * 100;
    const isLow = percentage < 30;
    const isCritical = percentage < 10;

    return (
        <GlassCard className="p-4">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className={`w-5 h-5 ${isCritical ? 'text-red-500' : isLow ? 'text-yellow-500' : 'text-purple-500'}`} />
                        <h3 className="font-semibold text-sm">Gemini AI Limits</h3>
                    </div>
                    <span className={`text-xs font-medium ${isCritical ? 'text-red-600 dark:text-red-400' : isLow ? 'text-yellow-600 dark:text-yellow-400' : 'text-muted'}`}>
                        {limits.remaining}/{limits.limit}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-muted/20 rounded-full overflow-hidden">
                    <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${isCritical
                                ? 'bg-gradient-to-r from-red-500 to-red-600'
                                : isLow
                                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                    : 'bg-gradient-to-r from-purple-500 to-purple-600'
                            }`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Status Info */}
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-muted">
                        <Clock className="w-3 h-3" />
                        <span>Resets in {timeUntilReset}</span>
                    </div>
                    {isCritical && (
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <AlertCircle className="w-3 h-3" />
                            <span>Low quota</span>
                        </div>
                    )}
                </div>

                {/* Warning Message */}
                {limits.remaining === 0 && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-xs text-red-600 dark:text-red-400">
                            Rate limit reached. Please wait {timeUntilReset} for reset.
                        </p>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
