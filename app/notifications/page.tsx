'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/PageLayout';
import { GlassCard } from '@/components/GlassCard';
import { NotificationPermission } from '@/components/NotificationPermission';
import { Bell, Check, Trash2, CheckCheck, Filter, Sparkles, Info, AlertCircle } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import toast from 'react-hot-toast';

type NotificationType = 'all' | 'reminder' | 'info' | 'success' | 'error';

export default function NotificationsPage() {
    const [filter, setFilter] = useState<NotificationType>('all');

    const notifications = useQuery(api.pushNotifications.getNotifications, { limit: 100 });
    const unreadCount = useQuery(api.pushNotifications.getUnreadCount);
    const markAsRead = useMutation(api.pushNotifications.markAsRead);
    const markAllAsRead = useMutation(api.pushNotifications.markAllAsRead);
    const deleteNotification = useMutation(api.pushNotifications.deleteNotification);
    const deleteAllNotifications = useMutation(api.pushNotifications.deleteAllNotifications);

    const filteredNotifications = notifications?.filter((n) =>
        filter === 'all' ? true : n.type === filter
    );

    const handleMarkAsRead = async (id: Id<"notifications">) => {
        try {
            await markAsRead({ id });
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleDelete = async (id: Id<"notifications">) => {
        try {
            await deleteNotification({ id });
            toast.success('Notification deleted', { icon: '🗑️' });
        } catch (error) {
            console.error('Error deleting:', error);
            toast.error('Failed to delete notification');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const count = await markAllAsRead();
            toast.success(`Marked ${count} notifications as read`, { icon: '✓' });
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark all as read');
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('Are you sure you want to delete all notifications?')) {
            return;
        }

        try {
            const count = await deleteAllNotifications();
            toast.success(`Deleted ${count} notifications`, { icon: '🗑️' });
        } catch (error) {
            console.error('Error deleting all:', error);
            toast.error('Failed to delete all notifications');
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'reminder':
                return <Sparkles className="w-5 h-5 text-purple-500" />;
            case 'info':
                return <Info className="w-5 h-5 text-blue-500" />;
            case 'success':
                return <Check className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Bell className="w-5 h-5 text-muted" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'reminder':
                return 'border-purple-500/30 bg-purple-500/5';
            case 'info':
                return 'border-blue-500/30 bg-blue-500/5';
            case 'success':
                return 'border-green-500/30 bg-green-500/5';
            case 'error':
                return 'border-red-500/30 bg-red-500/5';
            default:
                return 'border-muted/30';
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;

        return date.toLocaleDateString();
    };

    return (
        <PageLayout showNavigation={true} currentPage="notifications" showComposeFAB={true} showFooter={true}>
            <main className="container mx-auto px-4 sm:px-6 pt-24 pb-20">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold">Notifications</h1>
                            {unreadCount !== undefined && unreadCount > 0 && (
                                <p className="text-sm text-muted">{unreadCount} unread</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notification Permission Card */}
                <div className="mb-6">
                    <NotificationPermission />
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                    {/* Filter */}
                    <div className="flex items-center gap-2 flex-1">
                        <Filter className="w-4 h-4 text-muted" />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as NotificationType)}
                            className="flex-1 sm:flex-none px-3 py-2 rounded-lg glass-card text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">All Notifications</option>
                            <option value="reminder">Reminders</option>
                            <option value="info">Info</option>
                            <option value="success">Success</option>
                            <option value="error">Errors</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleMarkAllAsRead}
                            disabled={!unreadCount || unreadCount === 0}
                            className="btn-secondary px-3 sm:px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            <CheckCheck className="w-4 h-4" />
                            <span className="hidden sm:inline">Mark All Read</span>
                        </button>
                        <button
                            onClick={handleDeleteAll}
                            disabled={!notifications || notifications.length === 0}
                            className="btn-secondary px-3 sm:px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50 text-red-500"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete All</span>
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                {!filteredNotifications ? (
                    <div className="text-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                        <p className="text-muted mt-4">Loading notifications...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <GlassCard className="p-12 text-center">
                        <Bell className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold mb-2">No Notifications</h3>
                        <p className="text-muted">
                            {filter === 'all'
                                ? "You don't have any notifications yet"
                                : `No ${filter} notifications`}
                        </p>
                    </GlassCard>
                ) : (
                    <div className="space-y-3">
                        {filteredNotifications.map((notification) => (
                            <GlassCard
                                key={notification._id}
                                className={`p-4 border-2 transition-all ${notification.read ? 'opacity-60' : ''
                                    } ${getNotificationColor(notification.type)}`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Icon */}
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-semibold text-sm sm:text-base">
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs text-muted whitespace-nowrap">
                                                {formatTime(notification.sentAt)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted">{notification.body}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        {!notification.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification._id)}
                                                className="p-2 rounded-lg hover:bg-muted/20 transition-colors"
                                                title="Mark as read"
                                            >
                                                <Check className="w-4 h-4 text-green-500" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification._id)}
                                            className="p-2 rounded-lg hover:bg-muted/20 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </main>
        </PageLayout>
    );
}
