var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import notifyNewEntry, { notifyLinkFound, notifyNewWithLink } from "./notify.js";
import fetchEvents, { timeToEvent } from "./fetch.js";
import joinlink from "./joinlink.js";
import handleError from "./error.js";
import { readFile } from "./file.js";
/**
 * Function for sorting events from API into their seperate categories
 *
 * @param {array} events Events to sort
 * @param {boolean} notify Option to notify end user
 *
 * @see notifyNewWithLink(...)  Notifies the end user of a new event with a joinlink available
 * @see notifyNewEntry(...)     Notifies the end user of a new event
 * @see timeToEvent(...)        Returns the time to the event
 *
 * @returns Events and slowevents as objects
 */
export default function sortEvents({ events, notify }) {
    // Defines empty arrays
    let slow = [], notified = [];
    // Returns if there are no events to sort
    if (!events || !events.length) {
        console.log("Nothing to sort.");
        return { slow: [], notified: [] };
    }
    // Goes through each event
    events.forEach(event => {
        // Checks if event contains a joinlink
        if (joinlink(event)) {
            // If the user should be notified, notifies the user
            if (notify)
                notifyNewWithLink(event);
            // Pushes the event to the slowmonitored array
            slow.push(event);
            // If the event does not contain a joinlink, pushes it to the notified array
        }
        else {
            // Event is far away, console log when it will be added and return
            if (timeToEvent(event) > 1209600)
                return console.log(event.eventID, "will not be added till another", timeToEvent(event) - 1209600, "seconds have passed.");
            // If the user should be notified, notifies the user
            if (notify)
                notifyNewEntry(event);
            // Pushes the event to the notified array
            notified.push(event);
        }
    });
    // Returns the sorted object
    return { slow: slow, notified: notified };
}
/**
 * Function for checking notifiedEvents for joinlink and if so move them to slowMonitored.txt
 *
 * @param {array} events Events to check
 * @param {boolean} notify Option to notify the user that the joinlink is found
 *
 * @see notifyLinkFound(...)    Notifies the user that a link has been found for an already existing event
 * @see joinlink(...)           Fetches the joinlink for an event
 *
 * @returns Events that need to go to slowMonitored.txt
 */
export function sortNotified({ events, notify }) {
    // Defines array for events to be slowmonitored
    let slow = [];
    // Returns a empty array if there are no events to sort
    if (!events || !events.length)
        return [];
    // Goes through each event
    events.forEach(event => {
        // If there is a joinlink, logs that the event does not satisfy the requirements, and returns
        if (!joinlink(event))
            return console.log(`Event ${event.eventID} does not satisfy. The joinlink is ${joinlink(event)}`);
        // If the user should be notified, notifies the user
        if (notify)
            notifyLinkFound(event);
        // Pushes the event to the notified array
        slow.push(event);
    });
    // Returns the array
    return slow;
}
/**
 * Function for comparing events with slowevents and removing events that are already slowmonitored
 *
 * @see fetchEvents()       Fetches event from API
 * @see handleError(...)    Handles any error that occurs
 * @see readFile(...)       Reads from given file
 *
 * @returns                 Filtered object
 */
export function filterEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetches events
            let events = yield fetchEvents();
            // Fetches slow monitored events (events where changes are unlikely)
            let slowEvents = yield readFile("slow");
            // Filters events to avoid multiples of the same event 
            let filteredEvents = slowEvents.length ? events.filter(event => !slowEvents.some(slowevents => slowevents.eventID === event.eventID)) : events;
            // Handles error where the filtered events are undefined
            if (!filteredEvents) {
                handleError({
                    file: "filterEvents",
                    error: "filteredEvents is undefined"
                });
                return [];
            }
            // returns filtered events
            return filteredEvents;
            // Catches and handles any unknown errors
        }
        catch (error) {
            handleError({ file: "filterEvents", error: JSON.stringify(error) });
            return [];
        }
    });
}
