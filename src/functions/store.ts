import { readFile, writeFile } from './file.js'

type storeNewAndRemoveOldEventsProps = {
    events: DetailedEvent[]
    notified: DetailedEvent[]
    slow: DetailedEvent[]
}

type storeNotifiedProps = {
    events: DetailedEvent[]
}

type storeSlowMonitoredProps = {
    events: DetailedEvent[]
    overwrite?: boolean
}

/**
 * Stored new events, and removed events that have already taken place.
 * 
 * @param events     Events to act on
 * @param notified   Notified events to act on
 * @param slow       Slow events to act on
 * 
 * @see storeNotified(...)      Writes to notifiedEvents.json
 * @see storeSlowMonitored(...) Writes to slowMonitored.json
 */
export default async function storeNewAndRemoveOldEvents({events, notified, slow}: storeNewAndRemoveOldEventsProps): Promise<void> {
    // Logs for easy scanning of the console
    console.log("Stored new events, and removed events that have already taken place.")
    console.log(`events ${events.length} notified ${notified.length}, slowmonitored ${slow.length}`)
    
    // Defines the events to be added to each file
    const newNotifiedEvents = notified.filter(event => events.some(APIevent => APIevent.id === event.id))
    const newSlowEvents = slow.filter(slow => events.some(APIevent => APIevent.id === slow.id))

    // Stores each event in its appropriate file
    await storeNotified({events: newNotifiedEvents})
    await storeSlowMonitored({events: newSlowEvents})
}

/**
 * Writes events to notifiedEvents.json (they are coming up but they dont have a join link yet)
 * 
 * @param {object} events   Events to store
 * 
 * @see file(...)           Returns the full file path for the given argument
 * @see handleError(...)    Notifies the maintenance team of any error that occurs
 * @see writeFile(...)      Writes given content to given file
 */
export async function storeNotified({events}: storeNotifiedProps) {
    // Removes duplicates
    const unique = events.filter((event, index) => {
        return events.findIndex(obj => obj.id === event.id) === index
    })

    // Writes events to file
    writeFile({fileName: "notified", content: unique})
}

/**
 * Writes events to slowMonitored.json
 * 
 * @param {object} events       Events to be stored in slowMonitored.json
 * @param {boolean} overwrite   Boolean for if the file should be overwritten
 * 
 * @see handleError(...)        Notifies the maintenance team of any error
 * @see writeFile(...)          Writes given content to given file
 * @see readFile(...)           Reads content of given file
 */
export async function storeSlowMonitored({events, overwrite}: storeSlowMonitoredProps): Promise<void> {
    // Writes events to file
    if (overwrite) return writeFile({fileName: "slow", content: events})
    
    // Adds new events to array of slowmonitored events
    const slowEvents = await readFile("slow") as DetailedEvent[]
    const allevents = slowEvents.length > 0 ? slowEvents.concat(events) : events

    // Removes duplicates
    const filteredEvents = allevents.filter((event: DetailedEvent, index: number) => {
        return allevents.findIndex((obj: DetailedEvent) => obj.id === event.id) === index
    })

    // Returns if there is nothing to store
    if (!filteredEvents || !filteredEvents.length) return console.log(`Nothing new to store in slowMonitored.json. Total: ${allevents.length} events.`)

    // Writes filteredEvents to file
    return writeFile({fileName: "slow", content: filteredEvents})
}