import storeNewAndRemoveOldEvents from "./functions/storeNewAndRemoveOldEvents.mjs";
import fetchNotifiedEvents from "./functions/fetchnotifiedEvents.mjs";
import notifyNewWithLink from "./functions/notifyNewWithLink.mjs";
import notifyLinkFound from "./functions/notifyLinkFound.mjs";
import fetchSlowEvents from "./functions/fetchSlowEvents.mjs";
import notifyNewEntry from "./functions/notifyNewEntry.mjs";
import detailedEvents from "./functions/detailedEvents.mjs";
import fetchEvents from "./functions/fetchEvents.mjs";
import timeToEvent from "./functions/timeToEvent.mjs";
import joinlink from "./functions/joinlink.mjs";

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

    console.log("Automated notifications every minute.");

    // Terminates early if there are no events in database
    if(!(await fetchEvents()).length) {
        console.log("Found no events in database.");
        return null;
    }

    // Fetches api and txt files
    let events = await detailedEvents();
    let notified = await fetchNotifiedEvents();
    let slow = await fetchSlowEvents();
    
    // Logs amount of events of each type
    console.log("events:", events.length, "notified:", notified.length ? notified.length:0, "slowmonitored:", slow.length ? slow.length:0);

    // Finds new events
    let newEvents = (notified.length > 0 || slow.length > 0) ? events.filter(event => {
        !slow.some(Aevents => Aevents.eventID === event.eventID) || !notified.some(Nevents => Nevents.eventID === event.eventID);
    }):events;

    if(newEvents.length > 0) {
        newEvents.forEach(event => {
            console.log(event.eventID)
            if(joinlink(event)) {
                notifyNewWithLink(event); 
                slow.push(event);
            }
            else {
                if(timeToEvent(event) <= 1209600) {
                    notifyNewEntry(event); 
                    notified.push(event);
                }
            }
        });
    } else console.log("Nothing new to notify.");

    if(notified.length > 0) {
        notified.forEach(event => {
            if(joinlink(event)) {
                notifyLinkFound(event); 
                slow.push(event);
            } else console.log(`Event ${event.eventID} does not satisfy. The joinlink is ${joinlink(event)}`)
        });
    } else console.log("No new links found.");

    let newNotified = notified.filter(notified => !slow.some(slow => slow.eventID === notified.eventID));
    
    if(notified.length == newNotified.length) console.log("No new links found.");

    // Removes events that have already taken place and stores new events
    console.log("events:", events.length, "notified:", notified.length ? notified.length:0, "slowmonitored:", slow.length ? slow.length:0, "final");
    storeNewAndRemoveOldEvents(events, newNotified, slow);
}