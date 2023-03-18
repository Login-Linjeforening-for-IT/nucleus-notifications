import fetch from "node-fetch";
import handleError from "./handleError.mjs";

/**
 * Fetches api and returns events
 * 
 * @returns events
 */
export default async function fetchEvents() {
    try {
        let response = await fetch("https://api.login.no/events");
        let events = await response.json();
        if (!events) return handleError("fetchEvents.mjs", "Response from API is undefined");
        return events;
    } catch (e) {return handleError("fetchEvents.mjs", e)};
}