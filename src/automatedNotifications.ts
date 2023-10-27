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
    console.log("Interval started at", new Date().toISOString())

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
    if (events == undefined)    return handleError({file: "automatedNotifications", error: "events are initially undefined"})
    if (notified == undefined)  return handleError({file: "automatedNotifications", error: "notified are initially undefined"})
    if (slow == undefined)      return handleError({file: "automatedNotifications", error: "slow are initially undefined"})

    // Logs amount of events of each type
    console.log("events:", events.length, "notified:", notified ? notified.length : 0, "slowmonitored:", slow ? slow.length : 0)

    // Finds new events
    const newEvents = (notified.length > 0 || slow.length > 0) ? events.filter(event => {
        return (!slow.some(slowEvent => slowEvent.id === event.id) && !notified.some(notifiedEvent => notifiedEvent.id === event.id))
    }):events
    if (newEvents == undefined) return handleError({file: "automatedNotifications", error: "newEvents is undefined"})

    // Sorts events and pushes them to appropriate arrays
    const sortedEvents = sortEvents({events: newEvents, notify: true})
    if (sortedEvents == undefined) return handleError({file: "automatedNotifications", error: "sortedEvents is undefined"})
    sortedEvents.slow.forEach(event => {slow.push(event)})
    sortedEvents.notified.forEach(event => {notified.push(event)})

    // Finds newest version of events in notifiedarray
    const newNotified = notified.length > 0 ? events.filter(event => {
        return notified.some(Nevents => Nevents.id === event.id)
    }) : []

    // Handles notified events, potentially pushing them to slow if a link is found
    const sortedNotified = sortNotified({events: newNotified, notify: true})
    if (sortedNotified == undefined) return handleError({file: "automatedNotifications", error: "sortedNotified is undefined"})
    if (sortedNotified.length) sortedNotified.forEach(event => {slow.push(event)})

    // Returns if any variable to be stored is undefined
    if (events == undefined)        return handleError({file: "automatedNotifications", error: "events is undefined when storing"})
    if (newNotified == undefined)   return handleError({file: "automatedNotifications", error: "newNotified is undefined when storing"})
    if (slow == undefined)          return handleError({file: "automatedNotifications", error: "slow is undefined when storing"})
    
    // Removes events that have already taken place and stores new events
    storeNewAndRemoveOldEvents({events, notified: newNotified, slow})

    // Logs interval end time
    console.log("Interval complete at", new Date().toISOString())
}
