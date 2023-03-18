import fetchEventDetails from "./fetchEventDetails.mjs";    // Fetches details for all events
import filterEvents from "./filterEvents.mjs";              // Filters events to not include slowMonitored
import fetchEvents from "./fetchEvents.mjs";                // Fetches events from API
import handleError from "./handleError.mjs";                // Error handling

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
    if (unfiltered) {
        let events = await fetchEvents();
        let detailedEvents = await Promise.all(events.map(fetchEventDetails));
        
        if (!detailedEvents) return handleError("detailedEvents.mjs", "detailedEvents is undefined");

        console.log("Fetched details for all events unfiltered successfully.");
        return detailedEvents;
    }

    let events = await filterEvents();
    let detailedEvents = await Promise.all(events.map(fetchEventDetails));
   
    if (!detailedEvents) return handleError("detailedEvents.mjs", "detailedEvents is undefined");

    console.log("Fetched details for all events successfully.");
    return detailedEvents;
}