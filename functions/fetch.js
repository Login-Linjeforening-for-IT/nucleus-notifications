import info from '../data/info.json' assert { "type": "json" }
import { filterEvents } from "./sort.js";
import handleError from "./error.js";
import fetch from "node-fetch";

/**
 * Fetches api and returns events
 * 
 * @see handleError(...)    Schedule notifications instantly
 * 
 * @returns Events
 */
export default async function fetchEvents() {
    try {
        // Fetches events
        let response = await fetch("https://api.login.no/events");

        // Turns the text response into a JSON object
        let events = await response.json();

        // Handles case where the response is recieved, but undefined.
        if (!events) return handleError("fetchEvents", "Response from API is undefined");

        // Returns events if everything has successfull
        return events;

    // Catches and handles unknown errors
    } catch (error) {return handleError("fetchEvents", error)};
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
export async function fetchEventDetails(event) {
    const response = await fetch(`https://api.login.no/events/${event.eventID}`);
    const eventDetails = await response.json();

    // Handles error where details are not available
    if (!eventDetails) return handleError("fetchEventDetails", `Event ${event} has undefined details`);

    console.log(`Fetching details for event ${event.eventID}.`)
    
    // Returns the event as an object, with details attached
    return{...event, ...eventDetails};
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
export async function detailedEvents(unfiltered) {

    // Option to return unfiltered events
    if (unfiltered) {
        let events = await fetchEvents();
        let detailedEvents = await Promise.all(events.map(fetchEventDetails));
        
        if (!detailedEvents) return handleError("detailedEvents", "detailedEvents is undefined");

        console.log("Fetched details for all events unfiltered successfully.");
        return detailedEvents;
    }

    let events = await filterEvents();
    let detailedEvents = await Promise.all(events.map(fetchEventDetails));
   
    if (!detailedEvents) return handleError("detailedEvents", "detailedEvents is undefined");

    console.log("Fetched details for all events successfully.");
    return detailedEvents;
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
      case 'tekkom':        return '🍕'
      case 'karrieredag':   return '👩‍🎓'
      case 'cft':           return '🧑‍💻'
      case 'fadderuka':     return '🍹'
      case 'social':        return '🥳'
      case 'bedpres':       return '👩‍💼'
      case 'login':         return '🚨'
      default:              return '💻'
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
export function timeToEvent (event) {
    const currentTime = new Date();                     // Current full date
    const eventTime = new Date(event.startt);           // Converting from string to date old and correct version
    let seconds = (eventTime - currentTime) / 1000;     // Subtracting and dividing from milliseconds to seconds

    if (summertime()) return seconds-9800;              // Checks for and subtracts two hours during summertime
    else              return seconds-7200;              // Otherwise subtracts one hour during wintertime
} 

/**
 * Checks for summertime
 * 
 * @returns {boolean} True if summertime otherwise false
 */
function summertime() {
    const date = new Date('2023-03-01');                // Date object for March 1st
    const offset = date.getTimezoneOffset();            // Time zone offset in minutes

    if (offset < 0) return true;                        // True if summertime
    else            return false;                       // False if wintertime
}

/**
 * Boolean for if the repository is stable. Allows notifications 
 * if true, otherwise the error causing an ustable state will terminate the 
 * program.
 * 
 * @returns {boolean} true if more than one hour has elapsed, otherwise false
 */
export function isStable() {
    // Returns true if more than one hour has elapsed since program start
    if ((new Date() - new Date(info.startTime)) / 3600000 > 1) return true
    
    // Otherwise returns false
    else return false
}

isStable()