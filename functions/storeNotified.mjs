import handleError from './handleError.mjs';
import file from './file.mjs';
import * as fs from 'fs';

/**
 * Writes events to notifiedEvents.txt (they are coming up but they dont have a join link yet)
 * 
 * @see fetchNotifiedEvents()   Reads notifiedEvents.txt
 * 
 * @param {object} events 
 */
export default async function storeNotified(events) {
    let f = file("notified");

    // Removes duplicates
    let unique = await events.filter((event, index) => {
        return events.findIndex(obj => obj.eventID === event.eventID) === index;
    });

    let stringifiedEvents = JSON.stringify(unique);

    fs.writeFile(f, stringifiedEvents, (err) => {
        if (err) return handleError(f, err);
        console.log(`Overwrote ${f}. Total: ${unique.length} events.`);
    });
};