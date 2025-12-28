
"use node";
import { internalAction } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { v } from "convex/values";

import { HASHTAG_DATABASE } from "./hashtags";

const PREDEFINED_TOPICS = Object.entries(HASHTAG_DATABASE).flatMap(([niche, subcategories]) =>
    Object.keys(subcategories).map((subcategory) => ({
        niche: niche.charAt(0).toUpperCase() + niche.slice(1), // Capitalize for consistency
        subcategory,
    }))
);

/**
 * 1. Generate Draft Action (Runs every 30 mins)
 * - Generates content via AI
 * - Saves to DB as "pending"
 * - Notifies user of new draft
 */
export const generateDraft = internalAction({
    args: {},
    handler: async (ctx) => {
        const API_URL = process.env.APIFREELLM_FREE_URL || "https://apifreellm.com/api/chat";
        const ENDPOINT_ID = "apifreellm-generate";

        // 1. Daily Limit Check (Max 15 per day)
        // We count ALL tweets created today (pending or posted) to avoid spamming DB
        const recentTweets = await ctx.runQuery(api.tweets.getRecentTweets, { limit: 50 });
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const tweetsLast24h = recentTweets.filter(t => t.createdAt > oneDayAgo);

        if (tweetsLast24h.length >= 15) {
            console.log("Daily tweet generation limit (15) reached. Skipping draft generation.");
            return;
        }

        // 2. Niche Balancing
        const nicheCounts: Record<string, number> = {};
        PREDEFINED_TOPICS.forEach(t => { nicheCounts[t.niche] = 0; });

        recentTweets.forEach(t => {
            if (t.niche && nicheCounts[t.niche] !== undefined) {
                nicheCounts[t.niche]++;
            }
        });

        let minCount = Infinity;
        Object.values(nicheCounts).forEach(c => {
            if (c < minCount) minCount = c;
        });

        const availableNiches = Object.keys(nicheCounts).filter(n => nicheCounts[n] === minCount);
        const candidateTopics = PREDEFINED_TOPICS.filter(t => availableNiches.includes(t.niche));
        const topic = candidateTopics[Math.floor(Math.random() * candidateTopics.length)];

        console.log(`Generating draft for: ${topic.niche} / ${topic.subcategory}`);

        // 3. Check Rate Limits
        const rateLimit = await ctx.runMutation(api.rateLimits.updateRateLimit, {
            endpoint: ENDPOINT_ID,
        });

        if (!rateLimit.success) {
            console.log(`Rate limit exceeded for ${ENDPOINT_ID}. Skipping.`);
            return;
        }

        // 4. Generate Content
        // Instructing AI to include hashtags
        const prompt = `Write a short, engaging tweet about ${topic.subcategory} in the ${topic.niche} niche. Include 2-3 relevant hashtags. Do not include quotes.`;

        // Retry loop for API calls
        let tweetContent = "";
        let attempt = 0;
        const maxAttempts = 3;

        while (attempt < maxAttempts) {
            try {
                attempt++;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    },
                    body: JSON.stringify({ message: prompt }),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`Attempt ${attempt} failed: APIFreeLLM status ${response.status}: ${errorText.substring(0, 200)}`);
                    if (attempt === maxAttempts) return; // Give up after max attempts
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
                    continue;
                }

                const data = await response.json();
                if (data.error || !data.response) {
                    console.error(`Attempt ${attempt} error:`, data);
                    if (attempt === maxAttempts) return;
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    continue;
                }

                tweetContent = data.response;
                break; // Success!

            } catch (error) {
                console.error(`Attempt ${attempt} exception:`, error);
                if (attempt === maxAttempts) return;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // 5. Save to DB (Status: Pending)
        await ctx.runMutation(api.tweets.addTweet, {
            text: tweetContent,
            status: "pending", // Important: Pending
            source: "timeline", // Generated for timeline
            isAiGenerated: true,
            aiModel: "apifreellm-free",
            niche: topic.niche,
            subcategory: topic.subcategory,
            aiPrompt: prompt,
        });

        // 6. Notify User (Draft ready)
        await ctx.runMutation(api.pushNotifications.createNotification, {
            title: "📝 New Tweet Draft Ready",
            body: `A new draft about ${topic.subcategory} is waiting for review or auto-posting.`,
            type: "info",
            data: { url: "/feed?filter=pending" },
        });

        // Push Notification
        try {
            await ctx.runAction(api.pushNotifications.sendPushNotification, {
                title: "New Draft ready! 📝",
                body: `Draft about ${topic.subcategory} generated.`,
                type: "info",
                data: { url: "/feed?filter=pending" },
                skipDbRecord: true,
            });
        } catch (err) {
            console.log("Push failed", err);
        }

    },
});

/**
 * 2. Post Pending Tweet Action (Runs every 2 hours)
 * - Finds oldest "pending" tweet
 * - Posts to Twitter API
 * - Updates status to "posted"
 */
export const postPendingTweet = internalAction({
    args: {},
    handler: async (ctx) => {
        // 1. Get Oldest Pending Tweet
        const tweetToPost = await ctx.runQuery(api.tweets.getOldestPendingTweet);

        if (!tweetToPost) {
            console.log("No pending tweets found to post.");
            return;
        }

        console.log(`Attempting to post tweet ${tweetToPost._id}...`);

        try {
            // 2. Post to Twitter
            // Using the same client as ComposeTweet
            const { twitterClient } = await import("../lib/twitter-client");

            // Check content length safety (though usually AI manages it, good to double check)
            if (tweetToPost.text.length > 280) {
                console.warn(`Tweet ${tweetToPost._id} is too long (${tweetToPost.text.length}), skipping.`);
                // Mark as failed so we don't get stuck on it
                await ctx.runMutation(api.tweets.updateTweetStatus, {
                    id: tweetToPost._id,
                    status: "failed",
                    errorMessage: "Tweet exceeds 280 characters",
                });
                return;
            }

            const twitterResponse = await twitterClient.v2.tweet(tweetToPost.text);
            const tweetId = twitterResponse.data.id;

            console.log("Successfully posted to Twitter:", tweetId);

            // 3. Update Status to Posted
            await ctx.runMutation(api.tweets.updateTweetStatus, {
                id: tweetToPost._id,
                status: "posted",
                tweetId: tweetId, // Save the X ID
            });

            // 4. Notify User
            await ctx.runMutation(api.pushNotifications.createNotification, {
                title: "🚀 Auto-tweet Posted!",
                body: `Your queued tweet was sent to X: "${tweetToPost.text.substring(0, 40)}..."`,
                type: "success",
                data: { url: "/feed" }
            });

            // Push Notification
            try {
                await ctx.runAction(api.pushNotifications.sendPushNotification, {
                    title: "Tweet Posted! 🚀",
                    body: `Sent to X: ${tweetToPost.text.substring(0, 40)}...`,
                    type: "success",
                    data: { url: "/feed" },
                    skipDbRecord: true,
                });
            } catch (err) {
                console.log("Push failed", err);
            }


        } catch (error: any) {
            console.error(`Failed to post tweet ${tweetToPost._id}:`, error);

            let errorMessage = error.message || "Auto-posting failed";
            // Check for duplicate content error from Twitter
            if (error?.code === 403 && error?.data?.detail?.includes("duplicate content")) {
                console.warn("Twitter rejected duplicate content. Marking as failed.");
                errorMessage = "Duplicate Content (Twitter rejected)";
            }

            // Update status to failed so we retry later or user fixes it
            await ctx.runMutation(api.tweets.updateTweetStatus, {
                id: tweetToPost._id,
                status: "failed",
                errorMessage: errorMessage,
            });

            // Notification for failure
            await ctx.runMutation(api.pushNotifications.createNotification, {
                title: "❌ Post Failed",
                body: `Could not auto-post tweet: ${errorMessage}`,
                type: "error",
                data: { url: "/feed?filter=failed" }
            });
        }
    },
});
