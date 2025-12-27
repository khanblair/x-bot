import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get current Gemini API rate limits
export const getRateLimits = query({
    args: {},
    handler: async (ctx) => {
        const limits = await ctx.db
            .query("geminiRateLimits")
            .withIndex("by_endpoint", (q) => q.eq("endpoint", "generate-tweet"))
            .first();

        if (!limits) {
            // Return default limits if not initialized
            return {
                endpoint: "generate-tweet",
                requestCount: 0,
                limit: 15, // 15 requests per minute for free tier
                resetTime: Date.now() + 60000, // Reset in 1 minute
                remaining: 15,
            };
        }

        // Check if we need to reset
        const now = Date.now();
        if (now >= limits.resetTime) {
            return {
                ...limits,
                requestCount: 0,
                resetTime: now + 60000,
                remaining: limits.limit,
            };
        }

        return {
            ...limits,
            remaining: Math.max(0, limits.limit - limits.requestCount),
        };
    },
});

// Update rate limit after API call
export const updateRateLimit = mutation({
    args: {
        endpoint: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("geminiRateLimits")
            .withIndex("by_endpoint", (q) => q.eq("endpoint", args.endpoint))
            .first();

        const now = Date.now();

        if (!existing) {
            // Create new rate limit entry
            await ctx.db.insert("geminiRateLimits", {
                endpoint: args.endpoint,
                requestCount: 1,
                limit: 15,
                resetTime: now + 60000,
                lastUpdated: now,
            });
            return { success: true, remaining: 14 };
        }

        // Check if we need to reset
        if (now >= existing.resetTime) {
            await ctx.db.patch(existing._id, {
                requestCount: 1,
                resetTime: now + 60000,
                lastUpdated: now,
            });
            return { success: true, remaining: existing.limit - 1 };
        }

        // Check if limit exceeded
        if (existing.requestCount >= existing.limit) {
            return {
                success: false,
                error: "Rate limit exceeded",
                resetTime: existing.resetTime,
                remaining: 0,
            };
        }

        // Increment request count
        await ctx.db.patch(existing._id, {
            requestCount: existing.requestCount + 1,
            lastUpdated: now,
        });

        return {
            success: true,
            remaining: existing.limit - (existing.requestCount + 1),
        };
    },
});

// Reset rate limit (for testing or manual reset)
export const resetRateLimit = mutation({
    args: {
        endpoint: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("geminiRateLimits")
            .withIndex("by_endpoint", (q) => q.eq("endpoint", args.endpoint))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                requestCount: 0,
                resetTime: Date.now() + 60000,
                lastUpdated: Date.now(),
            });
        }

        return { success: true };
    },
});
