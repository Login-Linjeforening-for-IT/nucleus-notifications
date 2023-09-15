/**
 * Main entry point of the application. Each file and feature is defined where
 * its used and at the start of the file. The project has been updated to be 
 * easy to onboard, as it is one of the simpler to understand, but more complex 
 * to use and maintain.
 */

import automatedNotifications from "./automatedNotifications.js";
import slowMonitored from "./slowMonitored.js";
import { test } from "./test.js";
import cron from "node-cron";

// Tests the application before putting it in automated production
await test()

// Schedules automatedNotifications to run every minute
cron.schedule("* * * * *", automatedNotifications);

// Schedules slowMonitored to run every 30 minutes
cron.schedule("*/30 * * * *", slowMonitored);