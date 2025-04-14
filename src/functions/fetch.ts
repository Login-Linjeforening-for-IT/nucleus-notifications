import { filterEvents } from "./sort.js"
import handleError from "./error.js"

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

        // Turns the text response into a json object
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

        // Turns the text response into a json object
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
 * @param {item} item Event or Ad to get the time for
 * 
 * @see summertime() Returns if the current time is summertime or wintertime
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

    // Checks for and subtracts one hour during the winter
    if (!isDaylightSavingTime()) return seconds - 3600

    return seconds
}

/**
 * Checks for Daylight Savings Time (DST)
 * 
 * @param {object} date [OPTIONAL] Date to check for DST, defaults to the current time
 * 
 * @returns {boolean} True if DST otherwise false
 */
export function isDaylightSavingTime(date: Date = new Date()): boolean {
    const dstStart = new Date(date.getFullYear(), 2, 31)
    const dstEnd = new Date(date.getFullYear(), 9, 27)
    return date > dstStart && date < dstEnd;
}
