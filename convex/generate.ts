
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
    args: { type: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const API_URL = process.env.APIFREELLM_FREE_URL || "https://apifreellm.com/api/chat";
        const ENDPOINT_ID = "apifreellm-generate";

        // 1. Daily Limit Check (Max 15 per day)
        // We count ALL tweets created today (pending or posted) to avoid spamming DB
        const recentTweets = await ctx.runQuery(api.tweets.getRecentTweets, { limit: 50 });
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const tweetsLast24h = recentTweets.filter(t => t.createdAt > oneDayAgo);

        if (tweetsLast24h.length >= 6) {
            console.log("Daily tweet generation limit (6) reached. Skipping draft generation.");
            return;
        }

        // 2. Subcategory Balancing
        // We want to rotate through subcategories evenly
        const subcategoryCounts: Record<string, number> = {};
        PREDEFINED_TOPICS.forEach(t => { subcategoryCounts[t.subcategory] = 0; });

        // Count recent usage
        recentTweets.forEach(t => {
            if (t.subcategory && subcategoryCounts[t.subcategory] !== undefined) {
                subcategoryCounts[t.subcategory]++;
            }
        });

        // Find least used
        let minCount = Infinity;
        Object.values(subcategoryCounts).forEach(c => {
            if (c < minCount) minCount = c;
        });

        // specific candidates
        const candidateTopics = PREDEFINED_TOPICS.filter(t => subcategoryCounts[t.subcategory] === minCount);
        const topic = candidateTopics[Math.floor(Math.random() * candidateTopics.length)];

        console.log(`Generating draft for: ${topic.niche} / ${topic.subcategory} (Usage count: ${minCount})`);

        // 3. Check Rate Limits
        const rateLimit = await ctx.runMutation(api.rateLimits.updateRateLimit, {
            endpoint: ENDPOINT_ID,
        });

        if (!rateLimit.success) {
            console.log(`Rate limit exceeded for ${ENDPOINT_ID}. Skipping.`);
            return;
        }


        // 4. Generate Content
        const type = args.type || "morning"; // Default to morning if not provided
        let prompt = "";

        // Shared base rules to reduce repetition and rigidity
        const baseRules = `
        Rules:
        1. **Length**: STRICTLY between 100-150 characters. This is a hard requirement. Concise, punchy text only.
        2. **Hashtags**: Include 1-3 targeted, trending hashtags from the ${topic.niche} niche (e.g., #AI or #FinTech). Research current trends to tie in.
        3. **Emojis/Hooks**: Use 1-2 relevant emojis for scroll-stopping visual hooks (e.g., 👇, 🧵, 💡).
        4. **Quotes**: Optional—use sparingly if they add credibility from experts.
        5. **Trends & Variety**: Tie into current events, memes, or trending topics for timeliness. Vary phrasing to keep content fresh and diverse.
        6. **Engagement**: End with a CTA like a question or poll to encourage replies/comments.
        7. **Threads**: Suggest threading (🧵) for deeper value where it fits, especially for educational content.
        `;

        if (type === "morning") {
            // Morning: Polls (Controversial/Trending)
            prompt = `Write a viral, high-engagement **POLL-STYLE** tweet about ${topic.subcategory} in the ${topic.niche} niche.
             
             Specific Rules:
             1. **Style**: Ask a controversial or trending question to spark debate.
             2. **Format**: Write the tweet text that precedes a poll (e.g., "Which is better?"). Suggest 2-4 poll options.
             3. **Goal**: Get people to vote, reply, or share.
             
             ${baseRules}
             
             Example: "AI agents are replacing remote workers fast. Is this progress or a disaster? 👇 #AI #FutureOfWork"`;
        } else if (type === "afternoon") {
            // Afternoon: Curiosity Gap / Question
            prompt = `Write a viral, high-engagement **CURIOSITY-HOOK** tweet about ${topic.subcategory} in the ${topic.niche} niche.
            
            Specific Rules:
            1. **Style**: Open loop / curiosity gap. Start with a counter-intuitive hook that makes them want more.
            2. **Format**: Ask a question or share a surprising idea; hint at a thread (🧵) for depth.
            3. **Goal**: Stop the scroll and drive thread reads.
            
            ${baseRules}
            
            Example: "Most think scaling SaaS takes years. I did it in 3 months with this AI hack... 🧵 #SaaS #AI"`;
        } else {
            // Evening: Educational / Hint
            prompt = `Write a viral, high-engagement **EDUCATIONAL-HINT** tweet about ${topic.subcategory} in the ${topic.niche} niche.
            
            Specific Rules:
            1. **Style**: Share a valuable tip, "did you know", or quick win with proof/data.
            2. **Format**: Give upfront value but tease more (e.g., via thread 🧵 or reply).
            3. **Goal**: Educate, build authority, and spark interactions.
            
            ${baseRules}
            
            Example: "Ditch console.log for debugging—use this tool to save 50% time. Proof in thread. 💡 #WebDev #DevTips"`;
        }

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
        // 6. Notify User (Draft ready)
        // Context-Aware Notification
        let notifTitle = "New Draft ready! 📝";
        let notifBody = `Draft about ${topic.subcategory} generated.`;

        if (type === "morning") {
            notifTitle = "Morning Poll Draft Ready! ☀️";
            notifBody = `Review your poll about ${topic.subcategory}.`;
        } else if (type === "afternoon") {
            notifTitle = "Afternoon Hook Draft Ready! 🎣";
            notifBody = `Review your hook about ${topic.subcategory}.`;
        } else if (type === "evening") {
            notifTitle = "Evening Value Draft Ready! 📚";
            notifBody = `Review your educational post about ${topic.subcategory}.`;
        }

        await ctx.runMutation(api.pushNotifications.createNotification, {
            title: notifTitle,
            body: notifBody,
            type: "info",
            data: { url: "/feed?filter=pending" },
        });

        // Push Notification
        try {
            await ctx.runAction(api.pushNotifications.sendPushNotification, {
                title: notifTitle,
                body: notifBody,
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
            console.log("No pending tweets found. triggering immediate fallback generation...");

            // Determine type based on current hour to maintain strategy consistency
            // (Even though this is fallback, we try to match the slot)
            const hour = new Date().getUTCHours();
            let type = "morning";
            if (hour >= 17) type = "evening"; // > 5 PM UTC (approx) - tough with EST. 
            else if (hour >= 13) type = "afternoon"; // > 1 PM UTC

            // Trigger generation
            await ctx.runAction(internal.generate.generateDraft, { type });

            // Verify and fetch the newly created tweet
            // (Give DB a moment? No, mutations are consistent in Convex usually, but Action->Mutation might have delay? 
            // Query should see it if mutation finished. `generateDraft` awaits the mutation. So we are good.)
            const fallbackTweet = await ctx.runQuery(api.tweets.getOldestPendingTweet);

            if (!fallbackTweet) {
                console.error("Fallback generation failed or did not save in time.");
                return;
            }
            // Proceed with this tweet
            // We need to re-assign or reconstruct logic. 
            // Let's recursively call ourselves? No, safer to just continue.
            // But `tweetToPost` is const. Let's change it to let.
            // Actually, I can't change const. 
            // I'll wrap the posting logic in a helper or just reload the variable.

            // Wait, I cannot reassign const.
            // I will return `postPendingTweet` again?
            // await ctx.runAction(internal.generate.postPendingTweet);
            // return;
            // This is cleanest.
            await ctx.runAction(internal.generate.postPendingTweet);
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
