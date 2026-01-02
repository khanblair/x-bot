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

// --- Draft Generation: Hourly ---
// Runs at minute 0 of every hour to keep buffer full with variety
crons.cron(
    "generate-draft-hourly",
    "0 * * * *",
    internal.generate.generateDraft,
    {}
);

// --- Posting Schedule: 9 Posts Per Day ---

// MORNING BLOCK (EST 9:00 - 11:00)
crons.daily(
    "post-morning-1",
    { hourUTC: 14, minuteUTC: 0 }, // 9:00 AM EST (Growth)
    internal.generate.postPendingTweet,
    { type: "growth" }
);
crons.daily(
    "post-morning-poll",
    { hourUTC: 14, minuteUTC: 30 }, // 9:30 AM EST (Poll)
    internal.generate.postPendingTweet,
    { type: "morning" }
);
crons.daily(
    "post-morning-2",
    { hourUTC: 15, minuteUTC: 0 }, // 10:00 AM EST (Growth)
    internal.generate.postPendingTweet,
    { type: "growth" }
);

// AFTERNOON BLOCK (EST 13:00 - 15:00)
crons.daily(
    "post-afternoon-1",
    { hourUTC: 18, minuteUTC: 0 }, // 1:00 PM EST (Growth)
    internal.generate.postPendingTweet,
    { type: "growth" }
);
crons.daily(
    "post-afternoon-hook",
    { hourUTC: 18, minuteUTC: 30 }, // 1:30 PM EST (Hook)
    internal.generate.postPendingTweet,
    { type: "afternoon" }
);
crons.daily(
    "post-afternoon-2",
    { hourUTC: 19, minuteUTC: 0 }, // 2:00 PM EST (Growth)
    internal.generate.postPendingTweet,
    { type: "growth" }
);

// EVENING BLOCK (EST 17:00 - 19:00)
crons.daily(
    "post-evening-1",
    { hourUTC: 22, minuteUTC: 0 }, // 5:00 PM EST (Growth)
    internal.generate.postPendingTweet,
    { type: "growth" }
);
crons.daily(
    "post-evening-value",
    { hourUTC: 23, minuteUTC: 0 }, // 6:00 PM EST (Value)
    internal.generate.postPendingTweet,
    { type: "evening" }
);
crons.daily(
    "post-evening-2",
    { hourUTC: 23, minuteUTC: 30 }, // 6:30 PM EST (Growth)
    internal.generate.postPendingTweet,
    { type: "growth" }
);

export default crons;
