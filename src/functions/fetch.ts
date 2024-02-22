import { filterEvents } from "./sort.js"
import handleError from "./error.js"
import fetch from "node-fetch"

const api = "https://workerbee.login.no/api/"
const testapi = "https://testapi.login.no/api/"

/**
 * Fetches api and returns events
 * 
 * @see handleError(...)    Schedule notifications instantly
 * 
 * @returns Events
 */
export default async function fetchEvents(): Promise<EventProps[]> {
    try {
        // Fetches events
        const response = await fetch(`${api}events`)

        // Test API
        // const response = await fetch(`${testapi}events`)

        // Turns the text response into a JSON object
        const events = await response.json() as EventProps[]

        // Handles case where the response is recieved, but undefined.
        if (!events) {
            handleError({file: "fetch", error: "Event response from API is undefined"})
            return []
        }

        // Returns events if everything has successfull
        return events

    // Catches and handles unknown errors
    } catch (error: any) {
        handleError({file: "fetchEvents", error})
        return []
    }
}

/**
 * Fetches api and returns events
 * 
 * @see handleError(...)    Schedule notifications instantly
 * 
 * @returns Events
 */
export async function fetchAds(): Promise<AdProps[]> {
    try {
        // Prod
        const response = await fetch(`${api}jobs/`)

        // Dev
        // const response = await fetch(`${testapi}jobs/`)

        // Turns the text response into a JSON object
        const ads = await response.json() as AdProps[]

        // Handles case where the response is recieved, but undefined.
        if (!ads) {
            handleError({file: "fetch", error: "Ad response from API is undefined"})
            return []
        }

        // Returns events if everything has successfull
        return ads

    // Catches and handles unknown errors
    } catch (error: any) {
        handleError({file: "fetch", error})
        return []
    }
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
export async function fetchEventDetails(event: EventProps): Promise<DetailedEvent | undefined> {
    // Prod API
    const response = await fetch(`${api}events/${event.id}`)

    // Test API
    // const response = await fetch(`${testapi}events/${event.id}`)
    const eventDetails = await response.json() as DetailedEventResponse

    // Handles error where details are not available
    if (!eventDetails) return handleError({
        file: "fetchEventDetails", 
        error: `Event ${event} has undefined details`
    })
    
    // Returns the event as an object, with details attached
    return {
        ...event,
        ...eventDetails.event, 
        category_name_no: eventDetails.category.name_no,
        category_name_en: eventDetails.category.name_en
    }
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
export async function fetchAdDetails(ad: AdProps) {
    // Prod API
    const response = await fetch(`${api}jobs/${ad.id}`)

    // Test API
    // const response = await fetch(`${testapi}jobs/${ad.id}`)
    const adDetails = await response.json() as DetailedAd

    // Handles error where details are not available
    if (!adDetails) return handleError({
        file: "fetchAdDetails", 
        error: `Ad ${ad} has undefined details`
    })
    
    // Returns the event as an object, with details attached
    return {...ad, ...adDetails}
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
export async function detailedEvents(unfiltered?: boolean): Promise<DetailedEvent[]> {

    // Option to return unfiltered events
    if (unfiltered) {
        const events = await fetchEvents()
        const detailedEvents = await Promise.all(events.map(fetchEventDetails)) as DetailedEvent[]
        
        if (!detailedEvents) {
            handleError({file: "detailedEvents", error: "detailedEvents is undefined"})
            return []
        }

        console.log("Fetched details for all events unfiltered successfully.")
        return detailedEvents
    }

    const events = await filterEvents()
    const detailedEvents = await Promise.all(events.map(fetchEventDetails)) as DetailedEvent[]
   
    if (!detailedEvents) {
        handleError({file: "detailedEvents", error: "detailedEvents is undefined"})
        return []
    }

    console.log("Fetched details for all events successfully.")
    return detailedEvents
}

/**
 * Function for fetching a emoji to include in a string.
 * 
 * @param {object} event Event object
 * 
 * @returns {string} Emoji
 */
export function fetchEmoji(event: EventProps | DetailedEvent): string {
    switch ((event.category_name_no).toLowerCase()) {
        case 'tekkom':        return '🍕'
        case 'karrieredag':   return '👩‍🎓'
        case 'ctf':           return '🧑‍💻'
        case 'fadderuka':     return '🍹'
        case 'social':        return '🥳'
        case 'bedpres':       return '👩‍💼'
        case 'login':         return '🚨'
    }

    switch ((event.category_name_en).toLowerCase()) {
        case 'tekkom':        return '🍕'
        case 'career_day':    return '👩‍🎓'
        case 'ctf':           return '🧑‍💻'
        case 'fadderuka':     return '🍹'
        case 'social':        return '🥳'
        case 'bedpres':       return '👩‍💼'
        case 'login':         return '🚨'
    }

    return '💻'
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
export function timeToEvent (item: DetailedEvent | DetailedAd): number {
    // Current full date
    const currentTime = new Date()
    let startTime = new Date()

    if ('application_deadline' in item) {
        startTime = new Date(item.application_deadline)
    } else {
        startTime = new Date(item.time_start)
    }
    
    // Subtracting and dividing from milliseconds to seconds
    const seconds = (startTime.getTime() - currentTime.getTime()) / 1000

    // Checks for and subtracts two hours during summertime
    if (summertime()) return seconds - 9800

    // Otherwise subtracts one hour during wintertime
    else              return seconds - 7200
} 

/**
 * Checks for summertime
 * 
 * @returns {boolean} True if summertime otherwise false
 */
export function summertime(): boolean {
    // Date object for March 1st
    const date = new Date('2023-03-01')

    // Time zone offset in minutes
    const offset = date.getTimezoneOffset()

    // True if summertime
    if (offset < 0) return true

    // False if wintertime
    else            return false
}
