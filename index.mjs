import automatedNotifications from "./automatedNotification.mjs";
import slowMonitored from "./slowMonitored.mjs";
import cron from "node-cron";

cron.schedule("* * * * *", automatedNotifications);
cron.schedule("*/30 * * * *", slowMonitored);

