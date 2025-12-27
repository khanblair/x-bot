import { NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure web-push with VAPID keys
const vapidKeys = {
    publicKey: process.env.VAPID_PUBLIC_KEY!,
    privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails(
    'mailto:your@email.com', // Change this to your email
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { subscription, notification } = body;

        if (!subscription || !notification) {
            return NextResponse.json(
                { error: 'Missing subscription or notification data' },
                { status: 400 }
            );
        }

        // Send push notification
        await webpush.sendNotification(
            subscription,
            JSON.stringify(notification)
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error sending push notification:', error);

        // Handle subscription expiration
        if (error.statusCode === 410) {
            return NextResponse.json(
                { error: 'Subscription expired', expired: true },
                { status: 410 }
            );
        }

        return NextResponse.json(
            { error: error.message || 'Failed to send push notification' },
            { status: 500 }
        );
    }
}

// GET endpoint to return VAPID public key
export async function GET() {
    return NextResponse.json({
        publicKey: process.env.VAPID_PUBLIC_KEY,
    });
}
