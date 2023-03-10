import fetchEventDetails from "./fetchEventDetails.mjs";
import fetchEvents from "./fetchEvents.mjs";
import filterEvents from "./filterEvents.mjs";

/**
 * Calls fetchEventDetails for each event to map out all details to be monitored 
 * 
 * @see filterEvents()      Filters events based on their properties
 * @see fetchEventDetails   Fetches details for each event
 * 
 * @param {object} events Array of event objects
 * 
 * @returns All events with all details
 */
export default async function detailedEvents(unfiltered) {
    // Option to return unfiltered events
    if(unfiltered) {
        let events = await fetchEvents();
        let detailedEvents = await Promise.all(events.map(fetchEventDetails));
        console.log("Fetched details for all events unfiltered successfully.");
        return detailedEvents;
    }

    let events = await filterEvents();
    let detailedEvents = await Promise.all(events.map(fetchEventDetails));
    console.log("Fetched details for all events successfully.");
    return detailedEvents;
}