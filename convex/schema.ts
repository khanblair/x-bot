import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tweets: defineTable({
    // Twitter data
    tweetId: v.optional(v.string()), // Twitter's tweet ID (if successfully posted)
    text: v.string(),

    // Post status
    status: v.union(
      v.literal("pending"),
      v.literal("posted"),
      v.literal("failed")
    ),

    // Author info
    authorName: v.optional(v.string()),
    authorUsername: v.optional(v.string()),
    authorId: v.optional(v.string()),

    // Engagement metrics (from Twitter)
    likes: v.optional(v.number()),
    retweets: v.optional(v.number()),
    replies: v.optional(v.number()),
    quotes: v.optional(v.number()),

    // Error tracking
    errorMessage: v.optional(v.string()),
    errorCode: v.optional(v.number()),

    // Metadata
    createdAt: v.number(), // timestamp
    postedAt: v.optional(v.number()), // timestamp when successfully posted to Twitter

    // Search/filter fields
    source: v.union(
      v.literal("compose"), // Posted via compose
      v.literal("timeline"), // Fetched from timeline
      v.literal("search") // Fetched from search
    ),

    // Original query/username for context
    query: v.optional(v.string()),

    // AI Generation metadata
    isAiGenerated: v.optional(v.boolean()), // Flag for AI-generated tweets
    aiModel: v.optional(v.string()), // Model used (e.g., "apifreellm-free")
    niche: v.optional(v.string()), // Selected niche/category
    subcategory: v.optional(v.string()), // Selected subcategory
    aiGuidance: v.optional(v.string()), // User-provided guidance
    aiPrompt: v.optional(v.string()), // Full prompt sent to AI
    type: v.optional(v.string()), // Type of tweet (morning, afternoon, evening, growth)
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"])
    .index("by_tweet_id", ["tweetId"])
    .index("by_source", ["source"])
    .index("by_ai_generated", ["isAiGenerated"])
    .index("by_niche", ["niche"]),

  // API rate limiting
  rateLimits: defineTable({
    endpoint: v.string(), // API endpoint identifier
    requestCount: v.number(), // Current request count
    limit: v.number(), // Maximum allowed requests
    resetTime: v.number(), // Timestamp when limit resets
    lastRequestTime: v.number(), // Timestamp of last request (for per-request limits like APIFreeLLM)
    lastUpdated: v.number(), // Last update timestamp
  })
    .index("by_endpoint", ["endpoint"]),

  // Push notification subscriptions
  pushSubscriptions: defineTable({
    endpoint: v.string(), // Push subscription endpoint
    keys: v.object({
      p256dh: v.string(),
      auth: v.string(),
    }),
    userAgent: v.optional(v.string()), // Browser/device info
    createdAt: v.number(),
    lastUsed: v.number(),
  })
    .index("by_endpoint", ["endpoint"])
    .index("by_created", ["createdAt"]),

  // Notification history
  notifications: defineTable({
    title: v.string(),
    body: v.string(),
    icon: v.optional(v.string()),
    badge: v.optional(v.string()),
    data: v.optional(v.any()), // Additional data
    type: v.union(
      v.literal("reminder"),
      v.literal("info"),
      v.literal("success"),
      v.literal("error")
    ),
    read: v.boolean(),
    sentAt: v.number(),
    clickedAt: v.optional(v.number()),
  })
    .index("by_sent", ["sentAt"])
    .index("by_read", ["read"])
    .index("by_type", ["type"]),
});
