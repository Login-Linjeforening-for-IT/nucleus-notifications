import * as fs from 'fs';
import fetchNotifiedEvents from './fetchnotifiedEvents.mjs';

/**
 * Writes events to notifiedEvents.txt (they are coming up but they dont have a join link yet)
 * 
 * @see fetchNotifiedEvents()   Reads notifiedEvents.txt
 * 
 * @param {object} events 
 */
export default async function storeNotified(events) {
    let stringifiedEvents = JSON.stringify(events);
            fs.writeFile('./data/notifiedEvents.txt', stringifiedEvents, (err) => {
                if (err) throw err;
                console.log(`Overwrote notifiedEvents.txt. Total: ${events.length} events.`);
            });
}