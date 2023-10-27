import sendNotification from "./sendNotification.js"
import { fetchEmoji } from "./fetch.js"

/**
 * Schedules a notification to FCM if a new event has been found
 * 
 * @param {object} event        Event to schedule notification for
 * 
 * @see sendNotification(...)   Posts the notification to FCM
 * @see fetchEmoji(...)         Fetches a relevant emoji for the event
 */
export default async function notifyNewEntry(event: EventProps) {
    // Event category
    const category = event.category.toUpperCase()

    // Norwegian and english notification topics
    const norwegianTopic = `norwegian${category}`
    const englishTopic = `english${category}`

    // Formats start time
    const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`

    // Formats title
    const title = `${event.eventname} ${formattedStarttime}`

    // Defines body
    const norwegianBody = `Trykk her for å lese mer. ${fetchEmoji(event)}`
    const englishBody = `Click here to read more. ${fetchEmoji(event)}`

    // Sends the notification
    if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
    if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})

    // Logs success
    console.log(`Scheduled notifyNewEntry notification for event ${event.eventID}`)
}

/**
 * Schedules a notification to FCM if a join link has been found and updates slowMonitored.txt
 * 
 * @param {object} event        Event to schedule notification for
 * 
 * @see sendNotification(...)   Posts the notification to FCM servers
 * @see fetchEmoji(...)         Fetches a relevant emoji for the event
 */
export async function notifyLinkFound(event: DetailedEventProps) {
    // Event category
    const category = event.category.toUpperCase()

    // Norwegian and english notification topics
    const norwegianTopic = `norwegian${category}`
    const englishTopic = `english${category}`

    // Formats start time
    const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
    
    // Formats title
    const title = `${event.eventname} ${formattedStarttime}`
    
    // Defines body
    const norwegianBody = `Påmelding er ute! ${fetchEmoji(event)}`
    const englishBody = `Registration available! ${fetchEmoji(event)}`

    // Sends the notification
    if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
    if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})

    // Logs success
    console.log(`Scheduled notifyLinkFound notification for event ${event.eventID}`)
}

/**
 * Schedules a notification to FCM if a new event with a join link already available has been found and updates slowMonitored.txt
 * 
 * @see sendNotification(...)   Schedules a notification to FCM
 * @see fetchEmoji(...)         Fetches a relevant emoji for the event
 * 
 * @param {object} event        Event found
 */
export async function notifyNewWithLink(event: EventProps) {
    // Event category
    const category = event.category.toUpperCase()

    // Norwegian and english notification topics
    const norwegianTopic = `norwegian${category}`
    const englishTopic = `english${category}`

    // Formats start time
    const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`

    // Formats title
    const title = `${event.eventname} ${formattedStarttime}`

    // Defines body
    const norwegianBody = `Påmelding er allerede ute, trykk her for å lese mer! ${fetchEmoji(event)}`
    const englishBody = `Registration already available, click here to read more! ${fetchEmoji(event)}`

    // Sends the notification
    if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})        
    if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})

    // Logs success
    console.log(`Scheduled notifyNewWithLink notification for event ${event.eventID}`)
}
