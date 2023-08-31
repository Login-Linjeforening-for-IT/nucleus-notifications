import file, { readFile, writeFile } from './file.js';

/**
 * Stored new events, and removed events that have already taken place.
 * 
 * @param {object[]} events     Events to act on
 * @param {object[]} notified   Notified events to act on
 * @param {object[]} slow       Slow events to act on
 * 
 * @see storeNotified(...)      Writes to notifiedEvents.txt
 * @see storeSlowMonitored(...) Writes to slowMonitored.txt
 */
export default async function storeNewAndRemoveOldEvents(events, notified, slow) {
    // Logs for easy scanning of the console
    console.log("Stored new events, and removed events that have already taken place.")
    console.log(`events ${events.length} notified ${notified.length}, slowmonitored ${slow.length}`);
    
    // Defines the events to be added to each file
    let newNotifiedEvents = notified.filter(event => events.some(APIevent => APIevent.eventID === event.eventID));
    let newSlowEvents = slow.filter(slow => events.some(APIevent => APIevent.eventID === slow.eventID));

    // Stores each event in its appropriate file
    await storeNotified(newNotifiedEvents);
    await storeSlowMonitored(newSlowEvents);
}

/**
 * Writes events to notifiedEvents.txt (they are coming up but they dont have a join link yet)
 * 
 * @param {object} events   Events to store
 * 
 * @see file(...)           Returns the full file path for the given argument
 * @see handleError(...)    Notifies the maintenance team of any error that occurs
 * @see writeFile(...)      Writes given content to given file
 */
export async function storeNotified(events) {
    // Removes duplicates
    let unique = await events.filter((event, index) => {
        return events.findIndex(obj => obj.eventID === event.eventID) === index;
    });

    // Writes events to file
    await writeFile("notified", unique)
};

/**
 * Writes events to slowMonitored.txt
 * 
 * @param {object} events       Events to be stored in slowMonitored.txt
 * @param {boolean} overwrite   Boolean for if the file should be overwritten
 * 
 * @see handleError(...)        Notifies the maintenance team of any error
 * @see writeFile(...)          Writes given content to given file
 * @see readFile(...)           Reads content of given file
 */
export async function storeSlowMonitored(events, overwrite) {
    // Writes events to file
    if(overwrite) return await writeFile("slow", events)
    
    // Adds new events to array of slowmonitored events
    let slowEvents = await readFile("slow")
    let allevents = slowEvents.length > 0 ? slowEvents.concat(events):events;

    // Removes duplicates
    let filteredEvents = allevents.filter((event, index) => {
        return allevents.findIndex(obj => obj.eventID === event.eventID) === index;
    });
    
    // Returns if there is nothing to store
    if (!filteredEvents || !filteredEvents.length) return console.log(`Nothing new to store in slowMonitored.txt. Total: ${allevents.length} events.`)

    // Writes filteredEvents to file
    return await writeFile("slow", filteredEvents)
}