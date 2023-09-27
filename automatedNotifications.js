import storeNewAndRemoveOldEvents from "./functions/store.js";
import sortEvents, { sortNotified } from "./functions/sort.js";
import fetchEvents, { detailedEvents } from "./functions/fetch.js";
import reminders from "./functions/reminders.js";
import handleError from "./functions/error.js";
import { readFile } from "./functions/file.js";

/**
 * **Automated event notifications**
 * 
 * - Fetches API
 * - Stores events 
 * - Monitors events
 * - Schedules notifications
 * 
 * @see fetchEvents()               Fetches API
 * @see detailedEvents(...)         Returns all information about all events
 * @see readFile(...)               Reads content from given file
 * @see sortEvents(...)             Sorts events in different categories
 * @see sortNotified(...)           Filters out events not meant for notified
 * @see reminders()                 Schedules reminders for every event
 */
export default async function automatedNotifications() {
    // Logs interval start time
    console.log("Interval started at", new Date().toISOString());

    // Terminates early if there are no events in database
    if(!(await fetchEvents()).length) {
        console.log("Found no events in database.");
        return null;
    }

    // Schedules reminders
    await reminders();

    // Fetches api and txt files
    let events = await detailedEvents();
    let notified = await readFile("notified")
    let slow = await readFile("slow")

    // Returns if any variable is undefined
    if (events == undefined)    return handleError("automatedNotifications", "events are initially undefined");
    if (notified == undefined)  return handleError("automatedNotifications", "notified are initially undefined");
    if (slow == undefined)      return handleError("automatedNotifications", "slow are initially undefined");

    // Logs amount of events of each type
    console.log("events:", events.length, "notified:", notified ? notified.length:0, "slowmonitored:", slow ? slow.length:0);

    // Finds new events
    let newEvents = (notified.length > 0 || slow.length > 0) ? events.filter(event => {
        return (!slow.some(slowEvent => slowEvent.eventID === event.eventID) && !notified.some(notifiedEvent => notifiedEvent.eventID === event.eventID));
    }):events;
    if(newEvents == undefined) return handleError("automatedNotifications", "newEvents is undefined");

    // Sorts events and pushes them to appropriate arrays
    let sortedEvents = sortEvents(newEvents, true);
    if(sortedEvents == undefined) return handleError("automatedNotifications", "sortedEvents is undefined");
    sortedEvents.slow.forEach(event => {slow.push(event)});
    sortedEvents.notified.forEach(event => {notified.push(event)});

    // Finds newest version of events in notifiedarray
    let newNotified = notified.length > 0 ? events.filter(event => {
        return (notified.some(Nevents => Nevents.eventID === event.eventID));
    }):[];

    // Handles notified events, potentially pushing them to slow if a link is found
    let sortedNotified = sortNotified(newNotified, true);
    if(sortedNotified == undefined) return handleError("automatedNotifications", "sortedNotified is undefined");
    if (sortedNotified.length) sortedNotified.forEach(event => {slow.push(event)})

    // Returns if any variable to be stored is undefined
    if (events == undefined)        return handleError("automatedNotifications", "events is undefined when storing");
    if (newNotified == undefined)   return handleError("automatedNotifications", "newNotified is undefined when storing");
    if (slow == undefined)          return handleError("automatedNotifications", "slow is undefined when storing");
    
    // Removes events that have already taken place and stores new events
    await storeNewAndRemoveOldEvents(events, newNotified, slow);

    // Logs interval end time
    console.log("Interval complete at", new Date().toISOString());
};