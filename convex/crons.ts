import { cronJobs } from "convex/server";
import { internal, api } from "./_generated/api";

const crons = cronJobs();

// Send tweet reminder every 6 hours
crons.interval(
    "tweet-reminder",
    { hours: 6 }, // Every 6 hours
    internal.pushNotifications.sendTweetReminder
);

// Clean up old notifications daily at 3 AM
crons.daily(
    "cleanup-old-notifications",
    { hourUTC: 0, minuteUTC: 0 }, // 3 AM EAT (UTC+3)
    api.pushNotifications.cleanupOldNotifications
);

// --- Schedule: 3 Posts Per Day (Morning, Afternoon, Evening) ---
// Times in UTC (Targeting EST: UTC-5)
// Morning: 9 AM EST -> 14:00 UTC
// Afternoon: 1 PM EST -> 18:00 UTC
// Evening: 5 PM EST -> 22:00 UTC

// --- Draft Generation: Every 2 Hours (Odd Hours) ---
// Runs at 1, 3, 5, ... 13, 15, ... 21, 23 UTC.
// Avoids collision with Posting times (14, 18, 22 UTC).
crons.cron(
    "generate-draft-regular",
    "0 1-23/2 * * *",
    internal.generate.generateDraft,
    {}
);

// --- Posting Schedule: 3 Posts Per Day ---
// 1. Morning Post (9 AM EST -> 14:00 UTC)
crons.daily(
    "post-tweet-morning",
    { hourUTC: 14, minuteUTC: 0 },
    internal.generate.postPendingTweet
);

// 2. Afternoon Post (1 PM EST -> 18:00 UTC)
crons.daily(
    "post-tweet-afternoon",
    { hourUTC: 18, minuteUTC: 0 },
    internal.generate.postPendingTweet
);

// 3. Evening Post (5 PM EST -> 22:00 UTC)
crons.daily(
    "post-tweet-evening",
    { hourUTC: 22, minuteUTC: 0 },
    internal.generate.postPendingTweet
);

export default crons;
