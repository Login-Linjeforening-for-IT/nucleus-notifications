import fetch from "node-fetch";

/**
 * Fetches api and returns events
 * 
 * @returns events
 */
export default async function fetchEvents() {
    try {
        let response = await fetch("https://api.login.no/events");
        let events = await response.json();
        return events;
    } catch (e) {console.log(e)};
}