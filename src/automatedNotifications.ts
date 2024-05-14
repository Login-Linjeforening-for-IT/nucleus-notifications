import storeNewAndRemoveOldEvents from "./functions/store.js"
import sortEvents, { sortNotified } from "./functions/sort.js"
import fetchEvents, { detailedEvents } from "./functions/fetch.js"
import reminders from "./functions/reminders.js"
import handleError from "./functions/error.js"
import { readFile } from "./functions/file.js"

/**
 * **Automated event notifications**
 * 
 * - Fetches API
 * - Stores events 
 * - Monitors events
 * - Schedules notifications
 * 
 * @see fetchEvents()               Fetches API
 * @see detailedEvents(...)         Returns all information about all events
 * @see readFile(...)               Reads content from given file
 * @see sortEvents(...)             Sorts events in different categories
 * @see sortNotified(...)           Filters out events not meant for notified
 * @see reminders()                 Schedules reminders for every event
 */
export default async function automatedNotifications() {
    // Logs interval start time
    console.log(`Version: ${process.env.npm_package_version} Interval started at ${new Date().toISOString()}`)

    // Terminates early if there are no events in database
    if (!(await fetchEvents()).length) {
        console.log("Found no events in database.")
        return null
    }

    // Schedules reminders
    await reminders()

    // Fetches api and txt files
    const events = await detailedEvents() as DetailedEvent[]
    const notified = await readFile("notified") as DetailedEvent[]
    const slow = await readFile("slow") as DetailedEvent[]

    // Returns if any variable is undefined
    if (!isDefined(events, "events is initally undefined")) return
    if (!isDefined(notified, "notiifed is initally undefined")) return
    if (!isDefined(slow, "slow is initally undefined")) return

    // Logs amount of events of each type
    console.log("events:", events.length, "notified:", notified ? notified.length : 0, "slowmonitored:", slow ? slow.length : 0)

    // Finds new events
    const newEvents = (notified.length > 0 || slow.length > 0) ? events.filter(event => {
        return (!slow.some(slowEvent => slowEvent.id === event.id) && !notified.some(notifiedEvent => notifiedEvent.id === event.id))
    }):events
    if (!isDefined(newEvents, "newEvents is undefined")) return

    // Sorts events and pushes them to appropriate arrays
    const sortedEvents = sortEvents({events: newEvents, slow, notify: true})
    if (!isDefined(sortedEvents, "sortedEvents is undefined")) return
    sortedEvents.slow.forEach(event => {slow.push(event)})
    sortedEvents.notified.forEach(event => {notified.push(event)})

    // Finds newest version of events in notifiedarray
    const newNotified = notified.length > 0 ? events.filter(event => {
        return notified.some(Nevents => Nevents.id === event.id)
    }) : []

    // Handles notified events, potentially pushing them to slow if a link is found
    const sortedNotified = sortNotified({events: newNotified, slow, notify: true})
    if (!isDefined(sortedNotified, "sortedNotified is undefined")) return
    if (sortedNotified.length) {
        sortedNotified.forEach(event => {
            slow.push(event)
        })
    }

    // Returns if any variable to be stored is undefined
    if (!isDefined(events, "events is undefined when storing")) return
    if (!isDefined(newNotified, "newNotified is undefined when storing")) return
    if (!isDefined(slow, "slow is undefined when storing")) return

    // Removes events that have already taken place and stores new events
    storeNewAndRemoveOldEvents({events, notified: newNotified, slow})

    // Logs interval end time
    console.log(`Version: ${process.env.npm_package_version} Interval complete at ${new Date().toISOString()}`)
}

/**
 * Checks if the passed array is defined, true if defined, otherwise false
 * @param array Array to check
 * @param name Name of the array for the error message
 * @returns true | false
 */
function isDefined(item: any, error: string) {
    if (item == undefined) {
        handleError({file: "automatedNotifications", error})
        return false
    }
    
    return true
}
