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

// Generate a draft tweet every 30 minutes
crons.interval(
    "generate-draft",
    { minutes: 30 },
    internal.generate.generateDraft
);

// Post pending tweet every 2 hours
crons.interval(
    "post-pending-tweet",
    { hours: 2 },
    internal.generate.postPendingTweet
);

export default crons;
