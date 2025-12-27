import { v } from "convex/values";
import { mutation, query, action, internalMutation, internalAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

// Subscribe to push notifications
export const subscribeToPush = mutation({
    args: {
        endpoint: v.string(),
        keys: v.object({
            p256dh: v.string(),
            auth: v.string(),
        }),
        userAgent: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check if subscription already exists
        const existing = await ctx.db
            .query("pushSubscriptions")
            .withIndex("by_endpoint", (q) => q.eq("endpoint", args.endpoint))
            .first();

        if (existing) {
            // Update last used timestamp
            await ctx.db.patch(existing._id, {
                lastUsed: Date.now(),
            });
            return existing._id;
        }

        // Create new subscription
        const id = await ctx.db.insert("pushSubscriptions", {
            endpoint: args.endpoint,
            keys: args.keys,
            userAgent: args.userAgent,
            createdAt: Date.now(),
            lastUsed: Date.now(),
        });

        return id;
    },
});

// Unsubscribe from push notifications
export const unsubscribeFromPush = mutation({
    args: {
        endpoint: v.string(),
    },
    handler: async (ctx, args) => {
        const subscription = await ctx.db
            .query("pushSubscriptions")
            .withIndex("by_endpoint", (q) => q.eq("endpoint", args.endpoint))
            .first();

        if (subscription) {
            await ctx.db.delete(subscription._id);
            return true;
        }

        return false;
    },
});

// Get all active subscriptions
export const getSubscriptions = query({
    handler: async (ctx) => {
        const subscriptions = await ctx.db
            .query("pushSubscriptions")
            .collect();

        return subscriptions;
    },
});

// Create a notification record
export const createNotification = mutation({
    args: {
        title: v.string(),
        body: v.string(),
        icon: v.optional(v.string()),
        badge: v.optional(v.string()),
        data: v.optional(v.any()),
        type: v.union(
            v.literal("reminder"),
            v.literal("info"),
            v.literal("success"),
            v.literal("error")
        ),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("notifications", {
            title: args.title,
            body: args.body,
            icon: args.icon,
            badge: args.badge,
            data: args.data,
            type: args.type,
            read: false,
            sentAt: Date.now(),
        });

        return id;
    },
});

// Get all notifications (sorted by most recent)
export const getNotifications = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 50;

        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_sent")
            .order("desc")
            .take(limit);

        return notifications;
    },
});

// Get unread notification count
export const getUnreadCount = query({
    handler: async (ctx) => {
        const unread = await ctx.db
            .query("notifications")
            .withIndex("by_read", (q) => q.eq("read", false))
            .collect();

        return unread.length;
    },
});

// Mark notification as read
export const markAsRead = mutation({
    args: {
        id: v.id("notifications"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            read: true,
            clickedAt: Date.now(),
        });
    },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
    handler: async (ctx) => {
        const unread = await ctx.db
            .query("notifications")
            .withIndex("by_read", (q) => q.eq("read", false))
            .collect();

        for (const notification of unread) {
            await ctx.db.patch(notification._id, {
                read: true,
            });
        }

        return unread.length;
    },
});

// Delete notification
export const deleteNotification = mutation({
    args: {
        id: v.id("notifications"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Delete all notifications
export const deleteAllNotifications = mutation({
    handler: async (ctx) => {
        const notifications = await ctx.db.query("notifications").collect();

        for (const notification of notifications) {
            await ctx.db.delete(notification._id);
        }

        return notifications.length;
    },
});

// Clean up old notifications (older than 30 days)
export const cleanupOldNotifications = mutation({
    handler: async (ctx) => {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

        const oldNotifications = await ctx.db
            .query("notifications")
            .withIndex("by_sent")
            .filter((q) => q.lt(q.field("sentAt"), thirtyDaysAgo))
            .collect();

        for (const notification of oldNotifications) {
            await ctx.db.delete(notification._id);
        }

        return oldNotifications.length;
    },
});

// Send push notification action (calls external API)
export const sendPushNotification = action({
    args: {
        title: v.string(),
        body: v.string(),
        icon: v.optional(v.string()),
        badge: v.optional(v.string()),
        data: v.optional(v.any()),
        type: v.union(
            v.literal("reminder"),
            v.literal("info"),
            v.literal("success"),
            v.literal("error")
        ),
    },
    handler: async (ctx, args) => {
        // Create notification record
        await ctx.runMutation(api.pushNotifications.createNotification, {
            title: args.title,
            body: args.body,
            icon: args.icon,
            badge: args.badge,
            data: args.data,
            type: args.type,
        });

        // Get all subscriptions
        const subscriptions = await ctx.runQuery(api.pushNotifications.getSubscriptions);

        // Send to our API endpoint which will handle web-push
        const results = await Promise.allSettled(
            subscriptions.map(async (sub) => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-push`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            subscription: {
                                endpoint: sub.endpoint,
                                keys: sub.keys,
                            },
                            notification: {
                                title: args.title,
                                body: args.body,
                                icon: args.icon || "/icon-192.png",
                                badge: args.badge || "/icon-192.png",
                                data: args.data,
                            },
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to send push: ${response.statusText}`);
                    }

                    return { success: true, endpoint: sub.endpoint };
                } catch (error) {
                    console.error("Error sending push to", sub.endpoint, error);
                    return { success: false, endpoint: sub.endpoint, error };
                }
            })
        );

        const successful = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
        const failed = results.length - successful;

        return {
            total: results.length,
            successful,
            failed,
        };
    },
});

// Internal mutation for cron job - send tweet reminder
export const sendTweetReminder = internalMutation({
    handler: async (ctx) => {
        // Schedule the action to send push notifications
        await ctx.scheduler.runAfter(0, internal.pushNotifications.sendTweetReminderAction);
    },
});

// Internal action for sending tweet reminder
export const sendTweetReminderAction = internalAction({
    handler: async (ctx) => {
        await ctx.runAction(api.pushNotifications.sendPushNotification, {
            title: "✨ Time to Create!",
            body: "Generate an engaging tweet with AI and grow your X presence!",
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            data: { url: "/feed", action: "compose" },
            type: "reminder",
        });
    },
});

