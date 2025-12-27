import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add a new tweet
export const addTweet = mutation({
  args: {
    text: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("posted"),
      v.literal("failed")
    ),
    tweetId: v.optional(v.string()),
    authorName: v.optional(v.string()),
    authorUsername: v.optional(v.string()),
    authorId: v.optional(v.string()),
    likes: v.optional(v.number()),
    retweets: v.optional(v.number()),
    replies: v.optional(v.number()),
    quotes: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
    errorCode: v.optional(v.number()),
    source: v.union(
      v.literal("compose"),
      v.literal("timeline"),
      v.literal("search")
    ),
    query: v.optional(v.string()),
    // AI Generation metadata
    isAiGenerated: v.optional(v.boolean()),
    aiModel: v.optional(v.string()), // Model used
    niche: v.optional(v.string()),
    subcategory: v.optional(v.string()),
    aiGuidance: v.optional(v.string()),
    aiPrompt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    return await ctx.db.insert("tweets", {
      ...args,
      createdAt: now,
      postedAt: args.status === "posted" ? now : undefined,
    });
  },
});

// Update tweet status after Twitter post
export const updateTweetStatus = mutation({
  args: {
    id: v.id("tweets"),
    status: v.union(
      v.literal("pending"),
      v.literal("posted"),
      v.literal("failed")
    ),
    tweetId: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    errorCode: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      postedAt: args.status === "posted" ? Date.now() : undefined,
    });
  },
});

// Get all tweets with pagination
export const getTweets = query({
  args: {
    limit: v.optional(v.number()),
    source: v.optional(
      v.union(
        v.literal("compose"),
        v.literal("timeline"),
        v.literal("search")
      )
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let tweetsQuery = ctx.db.query("tweets").order("desc");

    if (args.source) {
      tweetsQuery = tweetsQuery.filter((q) => q.eq(q.field("source"), args.source));
    }

    return await tweetsQuery.take(limit);
  },
});

// Get tweets by status
export const getTweetsByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("posted"),
      v.literal("failed")
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    return await ctx.db
      .query("tweets")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .order("desc")
      .take(limit);
  },
});

// Search tweets by text
export const searchTweets = query({
  args: {
    searchText: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const searchLower = args.searchText.toLowerCase();

    const allTweets = await ctx.db
      .query("tweets")
      .order("desc")
      .take(200); // Search within recent 200 tweets

    return allTweets
      .filter((tweet) => tweet.text.toLowerCase().includes(searchLower))
      .slice(0, limit);
  },
});

// Get tweet by Twitter ID
export const getTweetByTwitterId = query({
  args: {
    tweetId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tweets")
      .withIndex("by_tweet_id", (q) => q.eq("tweetId", args.tweetId))
      .first();
  },
});

// Delete a tweet
export const deleteTweet = mutation({
  args: {
    id: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Get stats
export const getStats = query({
  handler: async (ctx) => {
    const allTweets = await ctx.db.query("tweets").collect();

    return {
      total: allTweets.length,
      posted: allTweets.filter((t) => t.status === "posted").length,
      failed: allTweets.filter((t) => t.status === "failed").length,
      pending: allTweets.filter((t) => t.status === "pending").length,
    };
  },
});

// Get recent tweets for balancing algorithms
export const getRecentTweets = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tweets")
      .order("desc") // Newest first
      .take(args.limit ?? 50);
  },
});
