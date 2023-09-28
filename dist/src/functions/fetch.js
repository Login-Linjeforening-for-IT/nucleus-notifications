var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { filterEvents } from "./sort.js";
import handleError from "./error.js";
import startTime from '../data/info.js';
import fetch from "node-fetch";
/**
 * Fetches api and returns events
 *
 * @see handleError(...)    Schedule notifications instantly
 *
 * @returns Events
 */
export default function fetchEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetches events
            const response = yield fetch("https://api.login.no/events");
            // Turns the text response into a JSON object
            const events = yield response.json();
            // Handles case where the response is recieved, but undefined.
            if (!events) {
                handleError({ file: "fetchEvents", error: "Response from API is undefined" });
                return [];
            }
            // Returns events if everything has successfull
            return events;
            // Catches and handles unknown errors
        }
        catch (error) {
            handleError({ file: "fetchEvents", error });
            return [];
        }
    });
}
/**
 * Fetches the specific event page for additional details
 *
 * @param {object} event    Event to fetch details for
 *
 * @see handleError(...)    Notifies maintenance team of any error
 *
 * @returns All details for passed event
 */
export function fetchEventDetails(event) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://api.login.no/events/${event.eventID}`);
        const eventDetails = yield response.json();
        // Handles error where details are not available
        if (!eventDetails)
            return handleError({
                file: "fetchEventDetails",
                error: `Event ${event} has undefined details`
            });
        console.log(`Fetching details for event ${event.eventID}.`);
        // Returns the event as an object, with details attached
        return Object.assign(Object.assign({}, event), eventDetails);
    });
}
/**
 * Calls fetchEventDetails for each event to map out all details to be monitored
 *
 * @param {object} unfiltered   Boolean option for unfiltered
 *
 * @see fetchEventDetails(...)  Fetches details for each event
 * @see filterEvents()       Filters events based on their properties
 * @see fetchEvents()        Fetches all events
 * @see handleError(...)        Notifies the maintenance team of any error
 *
 * @returns All events with all details
 */
export function detailedEvents(unfiltered) {
    return __awaiter(this, void 0, void 0, function* () {
        // Option to return unfiltered events
        if (unfiltered) {
            let events = yield fetchEvents();
            let detailedEvents = yield Promise.all(events.map(fetchEventDetails));
            if (!detailedEvents) {
                handleError({ file: "detailedEvents", error: "detailedEvents is undefined" });
                return [];
            }
            console.log("Fetched details for all events unfiltered successfully.");
            return detailedEvents;
        }
        let events = yield filterEvents();
        let detailedEvents = yield Promise.all(events.map(fetchEventDetails));
        if (!detailedEvents) {
            handleError({ file: "detailedEvents", error: "detailedEvents is undefined" });
            return [];
        }
        console.log("Fetched details for all events successfully.");
        return detailedEvents;
    });
}
/**
 * Function for fetching a emoji to include in a string.
 *
 * @param {object} event Event object
 *
 * @returns {string} Emoji
 */
export function fetchEmoji(event) {
    switch ((event.category).toLowerCase()) {
        case 'tekkom': return '🍕';
        case 'karrieredag': return '👩‍🎓';
        case 'cft': return '🧑‍💻';
        case 'fadderuka': return '🍹';
        case 'social': return '🥳';
        case 'bedpres': return '👩‍💼';
        case 'login': return '🚨';
        default: return '💻';
    }
}
/**
 * Returns the time till an event in seconds
 *
 * @param {event} event Event to get the time for
 *
 * @see summertime()    Returns if the current time is summertime or wintertime
 *
 * @returns {number} Seconds till event
 */
export function timeToEvent(event) {
    // Current full date
    const currentTime = new Date();
    // Converting from string to date old and correct version
    const eventTime = new Date(event.startt);
    // Subtracting and dividing from milliseconds to seconds
    let seconds = (eventTime.getMilliseconds() - currentTime.getMilliseconds()) / 1000;
    // Checks for and subtracts two hours during summertime
    if (summertime())
        return seconds - 9800;
    // Otherwise subtracts one hour during wintertime
    else
        return seconds - 7200;
}
/**
 * Checks for summertime
 *
 * @returns {boolean} True if summertime otherwise false
 */
export function summertime() {
    // Date object for March 1st
    const date = new Date('2023-03-01');
    // Time zone offset in minutes
    const offset = date.getTimezoneOffset();
    // True if summertime
    if (offset < 0)
        return true;
    // False if wintertime
    else
        return false;
}
/**
 * Boolean for if the repository is stable. Allows notifications
 * if true, otherwise the error causing an ustable state will terminate the
 * program.
 *
 * @returns {boolean} true if more than five minutes has elapsed, otherwise false
 */
export function isStable() {
    // Returns true if more than five minutes has elapsed since program start
    if ((new Date().getMilliseconds() - new Date(startTime).getMilliseconds()) / 300000 > 1)
        return true;
    // Otherwise returns false
    else
        return false;
}
