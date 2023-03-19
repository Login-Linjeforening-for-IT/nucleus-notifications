import storeNewAndRemoveOldEvents from "./functions/storeNewAndRemoveOldEvents.mjs";
import fetchNotifiedEvents from "./functions/fetchNotifiedEvents.mjs";
import fetchSlowEvents from "./functions/fetchSlowEvents.mjs";
import detailedEvents from "./functions/detailedEvents.mjs";
import sortNotified from "./functions/sortNotified.mjs";
import fetchEvents from "./functions/fetchEvents.mjs";
import currentTime from "./functions/currentTime.mjs";
import sortEvents from "./functions/sortEvents.mjs";
import reminders from "./functions/reminders.mjs";
import handleError from "./functions/handleError.mjs";

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

    if(!(await fetchEvents()).length) {
        console.log("Found no events in database.");
        return null;
    }

    await reminders();  // Schedules reminders

    // Terminates early if there are no events in database

    // Fetches api and txt files
    let events = await detailedEvents();
    let notified = await fetchNotifiedEvents();
    let slow = await fetchSlowEvents();
    if(events == undefined || newNotified == undefined || slow == undefined) return handleError("automatedNotification.mjs", `${events == undefined? "events":''} ${newNotified == undefined? "newNotified":''} ${slow == undefined? "slow":''} is undefined`);

    // Logs amount of events of each type
    console.log("events:", events.length, "notified:", notified.length ? notified.length:0, "slowmonitored:", slow.length ? slow.length:0);

    // Finds new events
    let newEvents = (notified.length > 0 || slow.length > 0) ? events.filter(event => {
        return (!slow.some(Aevents => Aevents.eventID === event.eventID) && !notified.some(Nevents => Nevents.eventID === event.eventID));
    }):events;
    if(newEvents == undefined) return handleError("automatedNotification.mjs", "newEvents is undefined");

    let sortedEvents = sortEvents(newEvents, true);
    if(sortedEvents == undefined) return handleError("automatedNotification.mjs", "sortedEvents is undefined");
    sortedEvents.slow.forEach(event => {slow.push(event)});
    sortedEvents.notified.forEach(event => {notified.push(event)});

    let sortedNotified = sortNotified(notified, true);
    if(sortedNotified == undefined) return handleError("automatedNotification.mjs", "sortedNotified is undefined");
    sortedNotified.forEach(event => {slow.push(event)})

    let newNotified = notified.filter(notified => !slow.some(slow => slow.eventID === notified.eventID));

    if(notified.length == newNotified.length) console.log("No new links found.");

    // Removes events that have already taken place and stores new events
    console.log("Storing", "events:", events.length, "notified:", notified.length ? notified.length:0, "slowmonitored:", slow.length ? slow.length:0);

    if(events == undefined || newNotified == undefined || slow == undefined) return handleError("automatedNotification.mjs", `${events == undefined? "events":''} ${newNotified == undefined? "newNotified":''} ${slow == undefined? "slow":''} is undefined`);
    await storeNewAndRemoveOldEvents(events, newNotified, slow);

    console.log("Interval complete at", currentTime());
};