/**
 * Main entry point of the application. Each file and feature is defined where
 * its used and at the start of the file. The project has been updated to be
 * easy to onboard, as it is one of the simpler to understand, but more complex
 * to use and maintain.
 */
import automatedNotifications from "./src/automatedNotifications.js";
import slowMonitored from "./src/slowMonitored.js";
import { schedule } from "node-cron";
import test from "./src/test.js";
// Tests the application before putting it in automated production
test();
// Schedules automatedNotifications to run every minute
schedule("* * * * *", automatedNotifications);
// Schedules slowMonitored to run every 30 minutes
schedule("*/30 * * * *", slowMonitored);
