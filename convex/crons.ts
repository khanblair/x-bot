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
// Times in UTC (User is UTC+3)
// Morning: 9 AM UTC+3 -> 6:00 UTC
// Afternoon: 2 PM UTC+3 -> 11:00 UTC
// Evening: 7 PM UTC+3 -> 16:00 UTC

// 1. Morning Cycle
crons.daily(
    "generate-draft-morning",
    { hourUTC: 5, minuteUTC: 0 }, // 8:00 AM UTC+3
    internal.generate.generateDraft,
    { type: "morning" }
);
crons.daily(
    "post-tweet-morning",
    { hourUTC: 6, minuteUTC: 0 }, // 9:00 AM UTC+3
    internal.generate.postPendingTweet
);

// 2. Afternoon Cycle
crons.daily(
    "generate-draft-afternoon",
    { hourUTC: 10, minuteUTC: 0 }, // 1:00 PM UTC+3
    internal.generate.generateDraft,
    { type: "afternoon" }
);
crons.daily(
    "post-tweet-afternoon",
    { hourUTC: 11, minuteUTC: 0 }, // 2:00 PM UTC+3
    internal.generate.postPendingTweet
);

// 3. Evening Cycle
crons.daily(
    "generate-draft-evening",
    { hourUTC: 15, minuteUTC: 0 }, // 6:00 PM UTC+3
    internal.generate.generateDraft,
    { type: "evening" }
);
crons.daily(
    "post-tweet-evening",
    { hourUTC: 16, minuteUTC: 0 }, // 7:00 PM UTC+3
    internal.generate.postPendingTweet
);

export default crons;
