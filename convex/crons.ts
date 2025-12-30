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

// 1. Morning Cycle
crons.daily(
    "generate-draft-morning",
    { hourUTC: 13, minuteUTC: 0 }, // 8:00 AM EST
    internal.generate.generateDraft,
    { type: "morning" }
);
crons.daily(
    "post-tweet-morning",
    { hourUTC: 14, minuteUTC: 0 }, // 9:00 AM EST
    internal.generate.postPendingTweet
);

// 2. Afternoon Cycle
crons.daily(
    "generate-draft-afternoon",
    { hourUTC: 17, minuteUTC: 0 }, // 12:00 PM EST
    internal.generate.generateDraft,
    { type: "afternoon" }
);
crons.daily(
    "post-tweet-afternoon",
    { hourUTC: 18, minuteUTC: 0 }, // 1:00 PM EST
    internal.generate.postPendingTweet
);

// 3. Evening Cycle
crons.daily(
    "generate-draft-evening",
    { hourUTC: 21, minuteUTC: 0 }, // 4:00 PM EST
    internal.generate.generateDraft,
    { type: "evening" }
);
crons.daily(
    "post-tweet-evening",
    { hourUTC: 22, minuteUTC: 0 }, // 5:00 PM EST
    internal.generate.postPendingTweet
);

export default crons;
