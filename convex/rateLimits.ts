import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get current API rate limits
export const getRateLimits = query({
    args: {
        endpoint: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const endpoint = args.endpoint || "apifreellm-generate"; // Default to APIFreeLLM

        // Define static limits for reference/fallback
        const limitsConfig: Record<string, { limit: number; window: number }> = {
            "generate-tweet": { limit: 15, window: 60000 }, // 15 per minute (auto-generation)
            "apifreellm-generate": { limit: 1, window: 5000 }, // 1 per 5 seconds (user-triggered AI)
        };
        const config = limitsConfig[endpoint] || limitsConfig["apifreellm-generate"];

        const limits = await ctx.db
            .query("rateLimits")
            .withIndex("by_endpoint", (q) => q.eq("endpoint", endpoint))
            .first();

        if (!limits) {
            // Return default limits if not initialized
            return {
                endpoint: endpoint,
                requestCount: 0,
                limit: config.limit,
                resetTime: Date.now() + config.window,
                remaining: config.limit,
            };
        }

        // Check if we need to reset
        const now = Date.now();
        if (now >= limits.resetTime) {
            return {
                ...limits,
                requestCount: 0,
                resetTime: now + config.window,
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
        // Define limits configuration again to be safe
        const limitsConfig: Record<string, { limit: number; window: number }> = {
            "generate-tweet": { limit: 15, window: 60000 }, // 15 per minute (auto-generation)
            "apifreellm-generate": { limit: 1, window: 5000 }, // 1 per 5 seconds (user-triggered AI)
        };
        const config = limitsConfig[args.endpoint] || limitsConfig["apifreellm-generate"];

        const existing = await ctx.db
            .query("rateLimits")
            .withIndex("by_endpoint", (q) => q.eq("endpoint", args.endpoint))
            .first();

        const now = Date.now();

        if (!existing) {
            // Create new rate limit entry - record the current request time
            await ctx.db.insert("rateLimits", {
                endpoint: args.endpoint,
                requestCount: 1,
                limit: config.limit,
                lastRequestTime: now, // Track when the last request was made
                resetTime: now + config.window, // Still keep resetTime for other endpoints
                lastUpdated: now,
            });
            return { success: true, remaining: config.limit - 1 };
        }

        // For APIFreeLLM (1 request per 5 seconds): check if 5 seconds have passed since last request
        if (args.endpoint === "apifreellm-generate") {
            const timeSinceLastRequest = now - existing.lastRequestTime;
            const FIVE_SECONDS = 5000;
            
            if (timeSinceLastRequest < FIVE_SECONDS) {
                const waitMs = FIVE_SECONDS - timeSinceLastRequest;
                const waitSeconds = Math.ceil(waitMs / 1000);
                return {
                    success: false,
                    error: `Rate limit exceeded. Please wait ${waitSeconds}s.`,
                    resetTime: now + waitMs,
                    remaining: 0,
                };
            }
            
            // 5 seconds have passed, allow the request
            await ctx.db.patch(existing._id, {
                lastRequestTime: now,
                lastUpdated: now,
            });
            return { success: true, remaining: 1 }; // Always 1 remaining for per-5sec limit
        }

        // For other endpoints, use window-based counting
        if (now >= existing.resetTime) {
            await ctx.db.patch(existing._id, {
                requestCount: 1,
                resetTime: now + config.window,
                lastUpdated: now,
            });
            return { success: true, remaining: existing.limit - 1 };
        }

        // Check if limit exceeded
        if (existing.requestCount >= existing.limit) {
            const waitMs = existing.resetTime - Date.now();
            const waitSeconds = Math.ceil(waitMs / 1000);
            return {
                success: false,
                error: `Rate limit exceeded. Please wait ${waitSeconds}s.`,
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
            .query("rateLimits")
            .withIndex("by_endpoint", (q) => q.eq("endpoint", args.endpoint))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                requestCount: 0,
                lastRequestTime: 0, // Reset so next request is allowed immediately
                lastUpdated: Date.now(),
            });
        }

        return { success: true };
    },
});
