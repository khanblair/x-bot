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
  })
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"])
    .index("by_tweet_id", ["tweetId"])
    .index("by_source", ["source"]),
});
