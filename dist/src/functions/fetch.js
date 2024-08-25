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
import fetch from "node-fetch";
const api = "https://workerbee.login.no/api/";
const testapi = "https://testapi.login.no/api/";
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
            const response = yield fetch(`${api}events`);
            // Test API
            // const response = await fetch(`${testapi}events`)
            // Turns the text response into a json object
            const events = yield response.json();
            // Handles case where the response is recieved, but undefined.
            if (!events) {
                handleError({ file: "fetch", error: "Event response from API is undefined" });
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
 * Fetches api and returns events
 *
 * @see handleError(...)    Schedule notifications instantly
 *
 * @returns Events
 */
export function fetchAds() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Prod
            const response = yield fetch(`${api}jobs/`);
            // Dev
            // const response = await fetch(`${testapi}jobs/`)
            // Turns the text response into a json object
            const ads = yield response.json();
            // Handles case where the response is recieved, but undefined.
            if (!ads) {
                handleError({ file: "fetch", error: "Ad response from API is undefined" });
                return [];
            }
            // Returns events if everything has successfull
            return ads;
            // Catches and handles unknown errors
        }
        catch (error) {
            handleError({ file: "fetch", error });
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
        // Prod API
        const response = yield fetch(`${api}events/${event.id}`);
        // Test API
        // const response = await fetch(`${testapi}events/${event.id}`)
        const eventDetails = yield response.json();
        // Handles error where details are not available
        if (!eventDetails)
            return handleError({
                file: "fetchEventDetails",
                error: `Event ${event} has undefined details`
            });
        // Returns the event as an object, with details attached
        return Object.assign(Object.assign(Object.assign({}, event), eventDetails.event), { category_name_no: eventDetails.category.name_no, category_name_en: eventDetails.category.name_en });
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
export function fetchAdDetails(ad) {
    return __awaiter(this, void 0, void 0, function* () {
        // Prod API
        const response = yield fetch(`${api}jobs/${ad.id}`);
        // Test API
        // const response = await fetch(`${testapi}jobs/${ad.id}`)
        const adDetails = yield response.json();
        // Handles error where details are not available
        if (!adDetails)
            return handleError({
                file: "fetchAdDetails",
                error: `Ad ${ad} has undefined details`
            });
        // Returns the event as an object, with details attached
        return Object.assign(Object.assign({}, ad), adDetails);
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
            const events = yield fetchEvents();
            const detailedEvents = yield Promise.all(events.map(fetchEventDetails));
            if (!detailedEvents) {
                handleError({ file: "detailedEvents", error: "detailedEvents is undefined" });
                return [];
            }
            console.log("Fetched details for all events unfiltered successfully.");
            return detailedEvents;
        }
        const events = yield filterEvents();
        const detailedEvents = yield Promise.all(events.map(fetchEventDetails));
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
    switch ((event.category_name_no).toLowerCase()) {
        case 'tekkom': return '🍕';
        case 'karrieredag': return '👩‍🎓';
        case 'ctf': return '🧑‍💻';
        case 'fadderuka': return '🍹';
        case 'social': return '🥳';
        case 'bedpres': return '👩‍💼';
        case 'login': return '🚨';
    }
    switch ((event.category_name_en).toLowerCase()) {
        case 'tekkom': return '🍕';
        case 'career_day': return '👩‍🎓';
        case 'ctf': return '🧑‍💻';
        case 'fadderuka': return '🍹';
        case 'social': return '🥳';
        case 'bedpres': return '👩‍💼';
        case 'login': return '🚨';
    }
    return '💻';
}
/**
 * Returns the time till an event in seconds
 *
 * @param {item} item Event or Ad to get the time for
 *
 * @see summertime() Returns if the current time is summertime or wintertime
 *
 * @returns {number} Seconds till event
 */
export function timeToEvent(item) {
    // Current full date
    const currentTime = new Date();
    let startTime = new Date();
    if ('application_deadline' in item) {
        startTime = new Date(item.application_deadline);
    }
    else {
        startTime = new Date(item.time_start);
    }
    // Subtracting and dividing from milliseconds to seconds
    const seconds = (startTime.getTime() - currentTime.getTime()) / 1000;
    // Checks for and subtracts one hour during the winter
    if (!isDaylightSavingTime())
        return seconds - 3600;
    return seconds;
}
/**
 * Checks for Daylight Savings Time (DST)
 *
 * @param {object} date [OPTIONAL] Date to check for DST, defaults to the current time
 *
 * @returns {boolean} True if DST otherwise false
 */
export function isDaylightSavingTime(date = new Date()) {
    const dstStart = new Date(date.getFullYear(), 2, 31);
    const dstEnd = new Date(date.getFullYear(), 9, 27);
    return date > dstStart && date < dstEnd;
}
