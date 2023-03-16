import * as fs from 'fs';

/**
 * Writes events to notifiedEvents.txt (they are coming up but they dont have a join link yet)
 * 
 * @see fetchNotifiedEvents()   Reads notifiedEvents.txt
 * 
 * @param {object} events 
 */
export default async function storeNotified(events) {

    // Removes duplicates
    let unique = events.filter((event, index) => {
        return events.findIndex(obj => obj.eventID === event.eventID) === index;
    });

    let stringifiedEvents = JSON.stringify(unique);

    fs.writeFile('./data/notifiedEvents.txt', stringifiedEvents, (err) => {
        if (err) throw err;
        console.log(`Overwrote notifiedEvents.txt. Total: ${unique.length} events.`);
    });
}