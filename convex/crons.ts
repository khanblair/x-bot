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

export default crons;
