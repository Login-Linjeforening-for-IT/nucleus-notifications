var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFile, writeFile } from './file.js';
/**
 * Stored new events, and removed events that have already taken place.
 *
 * @param events     Events to act on
 * @param notified   Notified events to act on
 * @param slow       Slow events to act on
 *
 * @see storeNotified(...)      Writes to notifiedEvents.json
 * @see storeSlowMonitored(...) Writes to slowMonitored.json
 */
export default function storeNewAndRemoveOldEvents({ events, notified, slow }) {
    // Logs for easy scanning of the console
    console.log("Stored new events, and removed events that have already taken place.");
    console.log(`events ${events.length} notified ${notified.length}, slowmonitored ${slow.length}`);
    // Defines the events to be added to each file
    const newNotifiedEvents = notified.filter(event => events.some(APIevent => APIevent.id === event.id));
    const newSlowEvents = slow.filter(slow => events.some(APIevent => APIevent.id === slow.id));
    // Stores each event in its appropriate file
    storeNotified({ events: newNotifiedEvents });
    storeSlowMonitored({ events: newSlowEvents });
}
/**
 * Writes events to notifiedEvents.json (they are coming up but they dont have a join link yet)
 *
 * @param {object} events   Events to store
 *
 * @see file(...)           Returns the full file path for the given argument
 * @see handleError(...)    Notifies the maintenance team of any error that occurs
 * @see writeFile(...)      Writes given content to given file
 */
export function storeNotified({ events }) {
    // Removes duplicates
    const unique = events.filter((event, index) => {
        return events.findIndex(obj => obj.id === event.id) === index;
    });
    // Writes events to file
    writeFile({ fileName: "notified", content: unique });
}
/**
 * Writes events to slowMonitored.json
 *
 * @param {object} events       Events to be stored in slowMonitored.json
 * @param {boolean} overwrite   Boolean for if the file should be overwritten
 *
 * @see handleError(...)        Notifies the maintenance team of any error
 * @see writeFile(...)          Writes given content to given file
 * @see readFile(...)           Reads content of given file
 */
export function storeSlowMonitored({ events, overwrite }) {
    return __awaiter(this, void 0, void 0, function* () {
        // Writes events to file
        if (overwrite)
            return writeFile({ fileName: "slow", content: events });
        // Adds new events to array of slowmonitored events
        const slowEvents = yield readFile("slow");
        const allevents = slowEvents.length > 0 ? slowEvents.concat(events) : events;
        // Removes duplicates
        const filteredEvents = allevents.filter((event, index) => {
            return allevents.findIndex((obj) => obj.id === event.id) === index;
        });
        // Returns if there is nothing to store
        if (!filteredEvents || !filteredEvents.length) {
            return console.log(`Nothing new to store in slowMonitored.json. Total: ${allevents.length} events.`);
        }
        // Writes filteredEvents to file
        return writeFile({ fileName: "slow", content: filteredEvents });
    });
}
