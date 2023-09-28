import { EventProps, DetailedEventProps } from "../../types"
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
    let category = event.category.toUpperCase()

    // Norwegian and english notification topics
    let norwegianTopic = `norwegian${category}`
    let englishTopic = `english${category}`

    // Formats start time
    let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`

    // Formats title
    let title = `${event.eventname} ${formattedStarttime}`

    // Defines body
    let norwegianBody = `Trykk her for å lese mer. ${fetchEmoji(event)}`
    let englishBody = `Click here to read more. ${fetchEmoji(event)}`

    // Sends the notification
    if(norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
    if(englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})

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
    let category = event.category.toUpperCase()

    // Norwegian and english notification topics
    let norwegianTopic = `norwegian${category}`
    let englishTopic = `english${category}`

    // Formats start time
    let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
    
    // Formats title
    let title = `${event.eventname} ${formattedStarttime}`
    
    // Defines body
    let norwegianBody = `Påmelding er ute! ${fetchEmoji(event)}`
    let englishBody = `Registration available! ${fetchEmoji(event)}`

    // Sends the notification
    if(norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
    if(englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})

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
    let category = event.category.toUpperCase()

    // Norwegian and english notification topics
    let norwegianTopic = `norwegian${category}`
    let englishTopic = `english${category}`

    // Formats start time
    let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`

    // Formats title
    let title = `${event.eventname} ${formattedStarttime}`

    // Defines body
    let norwegianBody = `Påmelding er allerede ute, trykk her for å lese mer! ${fetchEmoji(event)}`
    let englishBody = `Registration already available, click here to read more! ${fetchEmoji(event)}`

    // Sends the notification
    if(norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})        
    if(englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})

    // Logs success
    console.log(`Scheduled notifyNewWithLink notification for event ${event.eventID}`)
}
