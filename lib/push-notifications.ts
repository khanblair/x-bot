// Push notification utility functions

export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return 'denied';
    }

    if (Notification.permission === 'granted') {
        return 'granted';
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission;
    }

    return Notification.permission;
}

export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
    try {
        // Check if service worker is supported
        if (!('serviceWorker' in navigator)) {
            console.warn('Service workers are not supported');
            return null;
        }

        // Check if push notifications are supported
        if (!('PushManager' in window)) {
            console.warn('Push notifications are not supported');
            return null;
        }

        // Request notification permission
        const permission = await requestNotificationPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission denied');
            return null;
        }

        // Get service worker registration
        const registration = await navigator.serviceWorker.ready;

        // Get VAPID public key from API
        const response = await fetch('/api/send-push');
        const { publicKey } = await response.json();

        if (!publicKey) {
            throw new Error('VAPID public key not found');
        }

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey) as unknown as BufferSource,
        });

        return subscription;
    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
        return null;
    }
}

export async function unsubscribeFromPushNotifications(): Promise<boolean> {
    try {
        if (!('serviceWorker' in navigator)) {
            return false;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error unsubscribing from push notifications:', error);
        return false;
    }
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
    try {
        if (!('serviceWorker' in navigator)) {
            return null;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        return subscription;
    } catch (error) {
        console.error('Error getting push subscription:', error);
        return null;
    }
}

export function isPushNotificationSupported(): boolean {
    return (
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window
    );
}

export function getNotificationPermission(): NotificationPermission {
    if (!('Notification' in window)) {
        return 'denied';
    }
    return Notification.permission;
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

// Send a test notification
export async function sendTestNotification(): Promise<void> {
    const permission = await requestNotificationPermission();

    if (permission === 'granted') {
        new Notification('Test Notification', {
            body: 'This is a test notification from X-Bot!',
            icon: '/icon-192.png',
            badge: '/icon-192.png',
        });
    }
}
