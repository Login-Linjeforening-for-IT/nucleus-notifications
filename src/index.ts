/**
 * Main entry point of the application. Each file and feature is defined where
 * its used and at the start of the file. The project has been updated to be 
 * easy to onboard, as it is one of the simpler to understand, but more complex 
 * to use and maintain.
 */

import nucleusNotifications from "./nucleusNotifications.ts"
import schedule from './schedule.ts'
import slowMonitored from "./slowMonitored.ts"
import test from "./test.ts"

// Internal test of the application before allowing it to send notifications to end users
test()

// Schedules nucleusNotifications to run every minute
schedule(1, () => nucleusNotifications())
schedule(30, () => slowMonitored())
