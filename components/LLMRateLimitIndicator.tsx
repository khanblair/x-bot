'use client';

import { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import { Sparkles, Clock, AlertCircle } from 'lucide-react';

interface LLMLimits {
    endpoint: string;
    requestCount: number;
    limit: number;
    resetTime: number;
    remaining: number;
}

export function LLMRateLimitIndicator() {
    const [limits, setLimits] = useState<LLMLimits | null>(null);
    const [timeUntilReset, setTimeUntilReset] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const fetchLimits = async () => {
        try {
            const response = await fetch('/api/ai-rate-limits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ endpoint: 'apifreellm-generate' }),
            });
            const data = await response.json();

            // Fetch current limits

            const getResponse = await fetch('/api/ai-rate-limits?endpoint=apifreellm-generate'); // Use GET for reading
            const getData = await getResponse.json();

            if (getData.success) {
                setLimits(getData.limits);
            }
        } catch (error) {
            console.error('Error fetching LLM limits:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLimits();
        const interval = setInterval(fetchLimits, 5000); // 5s refresh for 5s limit
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!limits) return;

        const updateTimer = () => {
            const now = Date.now();
            const diff = limits.resetTime - now;

            if (diff <= 0) {
                setTimeUntilReset('Ready');
                // if it was waiting, maybe refetch
                return;
            }

            const seconds = Math.floor(diff / 1000);
            const remainingSeconds = seconds % 60;

            setTimeUntilReset(`${remainingSeconds}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 100);
        return () => clearInterval(interval);
    }, [limits]);

    if (loading) {
        return (
            <GlassCard className="p-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-muted/20 rounded w-3/4 mb-2"></div>
                </div>
            </GlassCard>
        );
    }

    if (!limits) return null;

    const percentage = (limits.remaining / limits.limit) * 100;
    const isLow = percentage < 30; // 0 remaining is low
    const isZero = limits.remaining === 0;

    return (
        <GlassCard className="p-4">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className={`w-5 h-5 ${isZero ? 'text-yellow-500' : 'text-purple-500'}`} />
                        <h3 className="font-semibold text-sm">AI Generation Limit</h3>
                    </div>
                    <span className={`text-xs font-medium ${isZero ? 'text-yellow-600' : 'text-muted'}`}>
                        {limits.remaining}/{limits.limit}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-muted/20 rounded-full overflow-hidden">
                    <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${isZero
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
                        {isZero ? (
                            <span>Reset in {timeUntilReset}</span>
                        ) : (
                            <span>Ready to generate</span>
                        )}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
