'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { GlassCard } from './GlassCard';
import {
    subscribeToPushNotifications,
    unsubscribeFromPushNotifications,
    getPushSubscription,
    isPushNotificationSupported,
    getNotificationPermission,
} from '@/lib/push-notifications';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import toast from 'react-hot-toast';

export function NotificationPermission() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isSupported, setIsSupported] = useState(true);

    const subscribeToPush = useMutation(api.pushNotifications.subscribeToPush);
    const unsubscribeFromPush = useMutation(api.pushNotifications.unsubscribeFromPush);

    useEffect(() => {
        checkSubscriptionStatus();
        setIsSupported(isPushNotificationSupported());
        setPermission(getNotificationPermission());
    }, []);

    const checkSubscriptionStatus = async () => {
        const subscription = await getPushSubscription();
        setIsSubscribed(!!subscription);
    };

    const handleSubscribe = async () => {
        setIsLoading(true);

        try {
            const subscription = await subscribeToPushNotifications();

            if (!subscription) {
                toast.error('Failed to subscribe to notifications', { icon: '❌' });
                return;
            }

            // Save subscription to Convex
            const subscriptionData = subscription.toJSON();
            await subscribeToPush({
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscriptionData.keys!.p256dh,
                    auth: subscriptionData.keys!.auth,
                },
                userAgent: navigator.userAgent,
            });

            setIsSubscribed(true);
            setPermission('granted');
            toast.success('Successfully subscribed to notifications!', { icon: '🔔' });
        } catch (error) {
            console.error('Error subscribing:', error);
            toast.error('Failed to subscribe to notifications', { icon: '❌' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnsubscribe = async () => {
        setIsLoading(true);

        try {
            const subscription = await getPushSubscription();

            if (subscription) {
                await unsubscribeFromPush({
                    endpoint: subscription.endpoint,
                });
            }

            await unsubscribeFromPushNotifications();

            setIsSubscribed(false);
            toast.success('Unsubscribed from notifications', { icon: '🔕' });
        } catch (error) {
            console.error('Error unsubscribing:', error);
            toast.error('Failed to unsubscribe', { icon: '❌' });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isSupported) {
        return (
            <GlassCard className="p-4 border-2 border-yellow-500/30">
                <div className="flex items-start gap-3">
                    <BellOff className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-sm mb-1">Notifications Not Supported</h4>
                        <p className="text-xs text-muted">
                            Your browser doesn't support push notifications.
                        </p>
                    </div>
                </div>
            </GlassCard>
        );
    }

    if (permission === 'denied') {
        return (
            <GlassCard className="p-4 border-2 border-red-500/30">
                <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-sm mb-1">Notifications Blocked</h4>
                        <p className="text-xs text-muted">
                            You've blocked notifications. Please enable them in your browser settings.
                        </p>
                    </div>
                </div>
            </GlassCard>
        );
    }

    return (
        <GlassCard className={`p-4 border-2 ${isSubscribed ? 'border-green-500/30' : 'border-purple-500/30'}`}>
            <div className="flex items-start gap-3">
                {isSubscribed ? (
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                    <Bell className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">
                        {isSubscribed ? 'Notifications Enabled' : 'Enable Notifications'}
                    </h4>
                    <p className="text-xs text-muted mb-3">
                        {isSubscribed
                            ? 'You\'ll receive tweet reminders and updates'
                            : 'Get reminders to create tweets and stay updated'}
                    </p>

                    <button
                        onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${isSubscribed
                                ? 'bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/30'
                                : 'bg-purple-500 text-white hover:bg-purple-600'
                            }`}
                    >
                        {isLoading
                            ? 'Loading...'
                            : isSubscribed
                                ? 'Disable Notifications'
                                : 'Enable Notifications'}
                    </button>
                </div>
            </div>
        </GlassCard>
    );
}
