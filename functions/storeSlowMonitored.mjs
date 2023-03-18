import fetchSlowEvents from './fetchSlowEvents.mjs';
import handleError from './handleError.mjs';
import file from './file.mjs';
import * as fs from 'fs';

/**
 * Writes events to slowMonitored.txt
 * 
 * @see fetchSlowEvents()   Reads events from slowMonitored.txt
 * 
 * @param {object} events   Events to be stored in slowMonitored.txt
 */
export default async function storeSlowMonitored(events, overwrite) {
    let f = file("slow");

    try {
        // Option to overwrite all slowmonitored events
        if(overwrite) {
            let stringifiedEvents = JSON.stringify(events);
            fs.writeFile(f, stringifiedEvents, (err) => {
                if (err) return handleError(f, err);
                console.log(`Overwrote ${f}. Now slowmonitoring ${events.length} events.`);
            });
            return;
        }

        // Adds new events to array of slowmonitored events
        let slowEvents = await fetchSlowEvents();
        let allevents = slowEvents.length > 0 ? slowEvents.concat(events):events;

        // Removes duplicates
        let filteredEvents = allevents.filter((event, index) => {
            return allevents.findIndex(obj => obj.eventID === event.eventID) === index;
        });
        
        // Stores the events
        if(events.length > 0) {
            let stringifiedEvents = JSON.stringify(filteredEvents);
            fs.writeFile(f, stringifiedEvents, (err) => {
                if (err) return handleError(f, err)
                console.log(`Added ${events.length} events to slowMonitored.txt. Total: ${allevents.length} events.`);
            });
        } else console.log(`Nothing new to store in slowMonitored.txt. Total: ${allevents.length} events.`)
    } catch (e) {return handleError(f, e)};
}