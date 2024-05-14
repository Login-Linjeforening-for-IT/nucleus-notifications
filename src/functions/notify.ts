import sendNotification from "./sendNotification.js"
import { fetchEmoji } from "./fetch.js"

type ScheduleProps = {
    event: DetailedEvent
    textNO: string
    textEN: string
    actionName: string
}

/**
 * Schedules a notification to FCM if a new event has been found
 * 
 * @param {object} event        Event to schedule notification for
 * 
 * @see sendNotification(...)   Posts the notification to FCM
 * @see fetchEmoji(...)         Fetches a relevant emoji for the event
 */
export default function schedule({event, textNO, textEN, actionName}: ScheduleProps) {
    // Event category
    const category_name_no = event.category_name_no.toUpperCase()
    const category_name_en = event.category_name_en.toUpperCase()

    // Norwegian and english notification topics
    const norwegianTopic = `n${category_name_no}`
    const englishTopic = `e${category_name_en}`

    // Formats start time
    const formattedStarttime = `${event.time_start[8]}${event.time_start[9]}.${event.time_start[5]}${event.time_start[6]}`

    // Formats title
    const name_no = `${event.name_no || event.name_en} ${formattedStarttime}`
    const name_en = `${event.name_en || event.name_no} ${formattedStarttime}`

    // Defines body
    const norwegianBody = `${textNO} ${fetchEmoji(event)}`
    const englishBody = `${textEN} ${fetchEmoji(event)}`

    // Sends the notification
    if (norwegianTopic) {
        sendNotification({
            title: name_no, 
            body: norwegianBody, 
            screen: event, 
            topic: norwegianTopic
        })
    }

    if (englishTopic) {
        sendNotification({
            title: name_en, 
            body: englishBody, 
            screen: event, 
            topic: englishTopic
        })
    }

    // Logs success
    console.log(`Scheduled ${actionName} notification for event ${event.id}`)
}
