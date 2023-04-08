import storeNewAndRemoveOldEvents from "./functions/storeNewAndRemoveOldEvents.mjs";
import fetchNotifiedEvents from "./functions/fetchNotifiedEvents.mjs";
import fetchSlowEvents from "./functions/fetchSlowEvents.mjs";
import detailedEvents from "./functions/detailedEvents.mjs";
import sortNotified from "./functions/sortNotified.mjs";
import fetchEvents from "./functions/fetchEvents.mjs";
import currentTime from "./functions/currentTime.mjs";
import handleError from "./functions/handleError.mjs";
import sortEvents from "./functions/sortEvents.mjs";
import reminders from "./functions/reminders.mjs";

/**
 * **Automated event notifications**
 * 
 * - Fetches API
 * - Stores events 
 * - Monitors events
 * - Schedules notifications
 * 
 * @see fetchEvents()           Fetches API
 * @see detailedEvents()        Returns all information about all events
 * @see fetchNotifiedEvents()   Reads events from notifiedEvents.txt
 * @see fetchSlowEvents()       Reads events from slowMonitored.txt
 * @see joinlink()              Fetches the joinlink of an event
 * @see notifyNewWithLink()     Schedules a notification for a new event with a link already available
 * @see notifyNewEntry()        Schedules a notification for a new event without a joinlink
 * @see notifyLinkFound()       Schedules a notification for an event where the link has just been posted
 * @see removePassedEvents()    Removes events that have already taken place
 */
export default async function automatedNotifications() {
    console.log("Interval started at", currentTime());

    // Terminates early if there are no events in database
    if(!(await fetchEvents()).length) {
        console.log("Found no events in database.");
        return null;
    }

    await reminders();  // Schedules reminders

    // Fetches api and txt files
    let events = await detailedEvents();
    let notified = await fetchNotifiedEvents();
    let slow = await fetchSlowEvents();

    // Returns if any variable is undefined
    if (events == undefined)    return handleError("automatedNotifications.mjs", "events are initially undefined");
    if (notified == undefined)  return handleError("automatedNotifications.mjs", "notified are initially undefined");
    if (slow == undefined)      return handleError("automatedNotifications.mjs", "slow are initially undefined");

    // Logs amount of events of each type
    console.log("events:", events.length, "notified:", notified ? notified.length:0, "slowmonitored:", slow ? slow.length:0);

    // Finds new events
    let newEvents = (notified.length > 0 || slow.length > 0) ? events.filter(event => {
        return (!slow.some(Aevents => Aevents.eventID === event.eventID) && !notified.some(Nevents => Nevents.eventID === event.eventID));
    }):events;
    if(newEvents == undefined) return handleError("automatedNotification.mjs", "newEvents is undefined");

    let sortedEvents = sortEvents(newEvents, true);
    if(sortedEvents == undefined) return handleError("automatedNotification.mjs", "sortedEvents is undefined");
    sortedEvents.slow.forEach(event => {slow.push(event)});
    sortedEvents.notified.forEach(event => {notified.push(event)});

    // Finds newest version of events in notifiedarray
    let newNotified = notified.length > 0 ? events.filter(event => {
        return (notified.some(Nevents => Nevents.eventID === event.eventID));
    }):[];

    let sortedNotified = sortNotified(newNotified, true);
    if(sortedNotified == undefined) return handleError("automatedNotification.mjs", "sortedNotified is undefined");
    if (sortedNotified.length) sortedNotified.forEach(event => {slow.push(event)})

    // Returns if any variable to be stored is undefined
    if (events == undefined)        return handleError("automatedNotifications.mjs", "events is undefined when storing");
    if (newNotified == undefined)   return handleError("automatedNotifications.mjs", "newNotified is undefined when storing");
    if (slow == undefined)          return handleError("automatedNotifications.mjs", "slow is undefined when storing");
    
    // Removes events that have already taken place and stores new events
    await storeNewAndRemoveOldEvents(events, newNotified, slow);

    console.log("Interval complete at", currentTime());
};