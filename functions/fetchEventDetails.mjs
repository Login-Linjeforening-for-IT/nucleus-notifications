import handleError from "./handleError.mjs";
import fetch from "node-fetch";

/**
 * Fetches the specific event page for additional details
 * 
 * @see fetchEventDetails() Fetches details for every event
 * 
 * @param {object} event    Event to fetch details for
 * 
 * @returns                 All details for passed event
 */
export default async function fetchEventDetails(event) {
    const response = await fetch(`https://api.login.no/events/${event.eventID}`);
    const eventDetails = await response.json();

    if (!eventDetails) return handleError("fetchEventDetails.mjs", `Event ${event} has undefined details`);

    console.log(`Fetching details for event ${event.eventID}.`)
    return{...event, ...eventDetails};
}