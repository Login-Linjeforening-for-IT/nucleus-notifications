import cron from "node-cron";
import automatedNotifications from "./automatedNotification.mjs";
import slowMonitored from "./slowMonitored.mjs";

cron.schedule("* * * * *", automatedNotifications);
cron.schedule("*/30 * * * *", slowMonitored);

