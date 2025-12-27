"use node";
import { internalAction } from "./_generated/server";
import { internal, api } from "./_generated/api";
import { v } from "convex/values";

const PREDEFINED_TOPICS = [
    { niche: "Tech", subcategory: "Web Development" },
    { niche: "Tech", subcategory: "AI & Machine Learning" },
    { niche: "Productivity", subcategory: "Time Management" },
    { niche: "Coding", subcategory: "JavaScript Tips" },
    { niche: "Career", subcategory: "Remote Work" },
];

export const generateTweet = internalAction({
    args: {},
    handler: async (ctx) => {
        const API_URL = process.env.APIFREELLM_FREE_URL || "https://apifreellm.com/api/chat";
        const ENDPOINT_ID = "apifreellm-generate";

        // 1. Daily Limit Check (Max 15 per day)
        const recentTweets = await ctx.runQuery(api.tweets.getRecentTweets, { limit: 50 });
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const tweetsLast24h = recentTweets.filter(t => t.createdAt > oneDayAgo);

        if (tweetsLast24h.length >= 15) {
            console.log("Daily tweet limit (15) reached. Skipping.");
            return;
        }

        // 2. Niche Balancing
        // Count usage of each niche in the recent history
        const nicheCounts: Record<string, number> = {};
        PREDEFINED_TOPICS.forEach(t => { nicheCounts[t.niche] = 0; });

        recentTweets.forEach(t => {
            if (t.niche && nicheCounts[t.niche] !== undefined) {
                nicheCounts[t.niche]++;
            }
        });

        // Find niches with minimum usage
        let minCount = Infinity;
        Object.values(nicheCounts).forEach(c => {
            if (c < minCount) minCount = c;
        });

        const availableNiches = Object.keys(nicheCounts).filter(n => nicheCounts[n] === minCount);

        // Filter topics that match available niches
        const candidateTopics = PREDEFINED_TOPICS.filter(t => availableNiches.includes(t.niche));
        const topic = candidateTopics[Math.floor(Math.random() * candidateTopics.length)];

        console.log(`Selected topic: ${topic.niche} / ${topic.subcategory} (Usage count: ${minCount})`);

        // 3. Check Rate Limits (APIFreeLLM)
        const rateLimit = await ctx.runMutation(api.rateLimits.updateRateLimit, {
            endpoint: ENDPOINT_ID,
        });

        if (!rateLimit.success) {
            console.log(`Rate limit exceeded for ${ENDPOINT_ID}. Skipping generation.`);
            return;
        }

        // 4. Generate Tweet
        const prompt = `Write a short, engaging tweet about ${topic.subcategory} in the ${topic.niche} niche. Include 2 relevant hashtags. Do not include quotes.`;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: prompt }),
            });

            const data = await response.json();

            if (data.error) {
                console.error("APIFreeLLM Error:", data.error);
                return;
            }

            const tweetContent = data.response;

            if (!tweetContent) {
                console.error("No content in response", data);
                return;
            }

            // 5. Post directly to Twitter
            try {
                // Import strictly inside the action to avoid build issues in non-node environments (though this is internalAction)
                const { twitterClient } = await import("../lib/twitter-client");

                console.log("Attempting to post to Twitter...");
                const twitterResponse = await twitterClient.v2.tweet(tweetContent);
                const tweetId = twitterResponse.data.id;

                console.log("Successfully posted to Twitter:", tweetId);

                // 6. Save to DB (Status: Posted)
                await ctx.runMutation(api.tweets.addTweet, {
                    text: tweetContent,
                    status: "posted",
                    tweetId: tweetId,
                    source: "compose",
                    isAiGenerated: true,
                    aiModel: "apifreellm-free",
                    niche: topic.niche,
                    subcategory: topic.subcategory,
                    aiPrompt: prompt,
                });

                // 7. Notify User
                await ctx.runAction(api.pushNotifications.sendPushNotification, {
                    title: "Tweet Posted Automatically!",
                    body: `Posted: ${tweetContent.substring(0, 50)}...`,
                    type: "success",
                    data: { url: "/feed" }
                });

            } catch (twitterError: any) {
                console.error("Failed to post to Twitter:", twitterError);

                // Save as failed/pending for manual review
                await ctx.runMutation(api.tweets.addTweet, {
                    text: tweetContent,
                    status: "failed",
                    source: "compose",
                    errorMessage: twitterError.message || "Auto-posting failed",
                    isAiGenerated: true,
                    aiModel: "apifreellm-free",
                    niche: topic.niche,
                    subcategory: topic.subcategory,
                    aiPrompt: prompt,
                });
            }

        } catch (error) {
            console.error("Error generating tweet:", error);
        }
    },
});
