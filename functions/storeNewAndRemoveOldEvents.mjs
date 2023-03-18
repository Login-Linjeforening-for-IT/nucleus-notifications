import storeSlowMonitored from "./storeSlowMonitored.mjs";
import storeNotified from "./storeNotified.mjs";

/**
 * Removes events that have passed.
 * 
 * @see fetchEvents()           Fetches events from database
 * @see fetchnotifiedEvents()   Reads events from notifiedEvents.txt
 * @see fetchSlowEvents()       Reads events from slowEvents.txt
 * @see storeNotified(...)      Writes to notifiedEvents.txt
 * @see storeSlowMonitored(...) Writes to slowMonitored.txt
 */
export default async function storeNewAndRemoveOldEvents(events, notified, slow) { 
    console.log("Stored new events, and removed events that have already taken place.")

    console.log("events", events.length, "notified", notified.length, "slowmonitored", slow.length);
    
    let newNotifiedEvents = notified.filter(event => events.some(APIevent => APIevent.eventID === event.eventID));
    let newSlowEvents = slow.filter(slow => events.some(APIevent => APIevent.eventID === slow.eventID));

    console.log("newNotifiedEvents", newNotifiedEvents.length)
    console.log("newSlowEvents", newSlowEvents.length)

    await storeNotified(newNotifiedEvents);
    await storeSlowMonitored(newSlowEvents);

}