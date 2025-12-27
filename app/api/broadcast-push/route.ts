import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

// Initialize Convex client for server-side
const getConvexClient = () => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!url) {
        throw new Error('NEXT_PUBLIC_CONVEX_URL is not set');
    }
    return new ConvexHttpClient(url);
};

// Configure web-push (lazy initialization)
const configureWebPush = () => {
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;

    if (!publicKey || !privateKey) {
        throw new Error('VAPID keys are not configured');
    }

    webpush.setVapidDetails(
        'mailto:manb10291@gmail.com',
        publicKey,
        privateKey
    );
};

export async function POST(request: Request) {
    try {
        // Configure web-push on first use
        configureWebPush();

        const body = await request.json();
        const { title, body: notificationBody, icon, badge, data, type } = body;

        // Get Convex client and fetch subscriptions
        const convex = getConvexClient();
        const subscriptions = await convex.query(api.pushNotifications.getSubscriptions);

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No subscriptions found',
                total: 0,
                successful: 0,
                failed: 0
            });
        }

        // Send to all subscriptions
        const results = await Promise.allSettled(
            subscriptions.map(async (sub) => {
                try {
                    const pushSubscription = {
                        endpoint: sub.endpoint,
                        keys: {
                            p256dh: sub.keys.p256dh,
                            auth: sub.keys.auth,
                        },
                    };

                    const payload = JSON.stringify({
                        title: title || 'X-Bot Notification',
                        body: notificationBody || 'You have a new notification',
                        icon: icon || '/icon-192.png',
                        badge: badge || '/icon-192.png',
                        data: data || { url: '/' },
                    });

                    await webpush.sendNotification(pushSubscription, payload);

                    return { success: true, endpoint: sub.endpoint };
                } catch (error: any) {
                    console.error('Error sending push to', sub.endpoint, error);

                    // If subscription is expired (410), we should remove it
                    if (error.statusCode === 410) {
                        try {
                            const convexClient = getConvexClient();
                            await convexClient.mutation(api.pushNotifications.unsubscribeFromPush, {
                                endpoint: sub.endpoint,
                            });
                            console.log('Removed expired subscription:', sub.endpoint);
                        } catch (removeError) {
                            console.error('Error removing expired subscription:', removeError);
                        }
                    }

                    return { success: false, endpoint: sub.endpoint, error: error.message };
                }
            })
        );

        const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
        const failed = results.length - successful;

        return NextResponse.json({
            success: true,
            total: results.length,
            successful,
            failed,
        });
    } catch (error: any) {
        console.error('Error in broadcast-push:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to broadcast push notifications' },
            { status: 500 }
        );
    }
}
