import fetchSlowEvents from "./fetchSlowEvents.mjs";
import fetchEvents from "./fetchEvents.mjs";
import handleError from "./handleError.mjs";

/**
 * Function for comparing events with slowevents and removing events that are already slowmonitored
 * 
 * @see fetchEvents()       Fetches event from API
 * @see fetchSlowEvents()   Reads events from slowMonitored.txt
 * 
 * @returns                 Filtered object
 */
export default async function filterEvents() {
    try {
        let events = await fetchEvents();
        let slowEvents = await fetchSlowEvents();
         console.log("inside filter", "events: ", events.length, "slowevents:", slowEvents.length ? slowEvents.length:0);
        let filteredEvents = slowEvents.length ? await events.filter(event => !slowEvents.some(slowevents => slowevents.eventID === event.eventID)):events;

        if(!filteredEvents) return handleError("filterEvents.mjs", "filteredEvents is undefined");

        return filteredEvents;   
    } catch (e) {return handleError("filterEvents.mjs", e)};
}