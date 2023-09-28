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
 * @param {object[]} events     Events to act on
 * @param {object[]} notified   Notified events to act on
 * @param {object[]} slow       Slow events to act on
 *
 * @see storeNotified(...)      Writes to notifiedEvents.txt
 * @see storeSlowMonitored(...) Writes to slowMonitored.txt
 */
export default function storeNewAndRemoveOldEvents({ events, notified, slow }) {
    // Logs for easy scanning of the console
    console.log("Stored new events, and removed events that have already taken place.");
    console.log(`events ${events.length} notified ${notified.length}, slowmonitored ${slow.length}`);
    // Defines the events to be added to each file
    let newNotifiedEvents = notified.filter(event => events.some(APIevent => APIevent.eventID === event.eventID));
    let newSlowEvents = slow.filter(slow => events.some(APIevent => APIevent.eventID === slow.eventID));
    // Stores each event in its appropriate file
    storeNotified({ events: newNotifiedEvents });
    storeSlowMonitored({ events: newSlowEvents });
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
export function storeNotified({ events }) {
    return __awaiter(this, void 0, void 0, function* () {
        // Removes duplicates
        let unique = events.filter((event, index) => {
            return events.findIndex(obj => obj.eventID === event.eventID) === index;
        });
        // Writes events to file
        writeFile({ fileName: "notified", content: unique });
    });
}
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
export function storeSlowMonitored({ events, overwrite }) {
    return __awaiter(this, void 0, void 0, function* () {
        // Writes events to file
        if (overwrite)
            return writeFile({ fileName: "slow", content: events });
        // Adds new events to array of slowmonitored events
        let slowEvents = yield readFile("slow");
        let allevents = slowEvents.length > 0 ? slowEvents.concat(events) : events;
        // Removes duplicates
        let filteredEvents = allevents.filter((event, index) => {
            return allevents.findIndex((obj) => obj.eventID === event.eventID) === index;
        });
        // Returns if there is nothing to store
        if (!filteredEvents || !filteredEvents.length)
            return console.log(`Nothing new to store in slowMonitored.txt. Total: ${allevents.length} events.`);
        // Writes filteredEvents to file
        return writeFile({ fileName: "slow", content: filteredEvents });
    });
}
