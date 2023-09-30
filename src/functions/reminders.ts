import sendNotification from "./sendNotification.js"
import { readFile, writeFile } from "./file.js"
import { detailedEvents, timeToEvent } from "./fetch.js"
import handleError from "./error.js"
import { fetchEmoji } from "./fetch.js"
import { EventProps, DetailedEventProps } from "../../types"

/**
 * Schedules a notification to FCM if a new event with a join link already available has been found and updates slowMonitored.txt
 * 
 * @see sendNotification(...)   Schedules a notification to FCM
 * @see readFile(...)           Reads from given file
 * @see timeToEvent(...)        Returns the time to event
 * @see fetchEmoji(...)         Fetches a relevant emoji for the event
 * @see writeFile(...)          Writes given content to given file
 */
export default async function reminders() {
    let reminders = 0

    // Fetches details for all events unfiltered.
    let events = await detailedEvents(true)

    if (!events) return handleError({
        file: "reminders",
        error: "events is undefined"
    })

    // Fetches events in each interval
    let stored10m = await readFile("10m") as DetailedEventProps[]
    let stored30m = await readFile("30m") as DetailedEventProps[]
    let stored1h  = await readFile("1h") as DetailedEventProps[]
    let stored2h  = await readFile("2h") as DetailedEventProps[]
    let stored3h  = await readFile("3h") as DetailedEventProps[]
    let stored6h  = await readFile("6h") as DetailedEventProps[]
    let stored1d  = await readFile("1d") as DetailedEventProps[]
    let stored2d  = await readFile("2d") as DetailedEventProps[]
    let stored1w  = await readFile("1w") as DetailedEventProps[]

    // Filters out events that are ready to be notified about
    let notify10m = stored10m.filter((event: EventProps) => timeToEvent(event) <= 600)
    let notify30m = stored30m.filter((event: EventProps) => timeToEvent(event) <= 1800)
    let notify1h = stored1h.filter((event: EventProps) => timeToEvent(event) <= 3600)
    let notify2h = stored2h.filter((event: EventProps) => timeToEvent(event) <= 7200)
    let notify3h = stored3h.filter((event: EventProps) => timeToEvent(event) <= 10800)
    let notify6h = stored6h.filter((event: EventProps) => timeToEvent(event) <= 21600)
    let notify1d = stored1d.filter((event: EventProps) => timeToEvent(event) <= 86400)
    let notify2d = stored2d.filter((event: EventProps) => timeToEvent(event) <= 172800)
    let notify1w = stored1w.filter((event: EventProps) => timeToEvent(event) <= 604800)

    // Schedules notifications for events 10 minutes away
    notify10m.forEach((event: EventProps) => {
        let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        let title = `${event.eventname} ${formattedStarttime}`
        
        // Notification topic
        let norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}10m`
        let englishTopic = `english${event.eventID}${(event.category).toLowerCase()}10m`

        // Notification body
        let norwegianBody = `Begynner om 10 minutter! ${fetchEmoji(event)}`
        let englishBody = `Starts in 10 minutes! ${fetchEmoji(event)}`
        
        // Sends notifications
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})

        // Increases reminders sent
        reminders+=2
    })

    // Schedules notifications for events 30 minutes away
    notify30m.forEach((event: EventProps) => {
        let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        let title = `${event.eventname} ${formattedStarttime}`

        // Notification topic
        let norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}30m`
        let englishTopic = `english${event.eventID}${(event.category).toLowerCase()}30m`

        // Notification body
        let norwegianBody = `Begynner om 30 minutter! ${fetchEmoji(event)}`
        let englishBody = `Starts in 30 minutes! ${fetchEmoji(event)}`

        // Sends notifications
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})

        // Increases reminders sent
        reminders+=2
    })

    // Schedules notifications for events 1 hour away
    notify1h.forEach((event: EventProps) => {
        let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        let title = `${event.eventname} ${formattedStarttime}`

        let norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}1h`
        let englishTopic = `english${event.eventID}${(event.category).toLowerCase()}1h`

        let norwegianBody = `Begynner om 1 time! ${fetchEmoji(event)}`
        let englishBody = `Starts in 1 hour! ${fetchEmoji(event)}`
        
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 2 hours away
    notify2h.forEach((event: EventProps) => {
        let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        let title = `${event.eventname} ${formattedStarttime}`
        
        let norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}2h`
        let englishTopic = `english${event.eventID}${(event.category).toLowerCase()}2h`

        let norwegianBody = `Begynner om 2 timer! ${fetchEmoji(event)}`
        let englishBody = `Starts in 2 hours! ${fetchEmoji(event)}`

        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 3 hours away
    notify3h.forEach((event: EventProps) => {
        let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        let title = `${event.eventname} ${formattedStarttime}`

        let norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}3h`
        let englishTopic = `english${event.eventID}${(event.category).toLowerCase()}3h`

        let norwegianBody = `Begynner om 3 timer! ${fetchEmoji(event)}`
        let englishBody = `Starts in 3 hours! ${fetchEmoji(event)}`
        
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 6 hours away
    notify6h.forEach((event: EventProps) => {
        let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        let title = `${event.eventname} ${formattedStarttime}`

        let norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}6h`
        let englishTopic = `english${event.eventID}${(event.category).toLowerCase()}6h`

        let norwegianBody = `Begynner om 6 timer! ${fetchEmoji(event)}`
        let englishBody = `Starts in 6 hours! ${fetchEmoji(event)}`
        
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 1 day away.
    notify1d.forEach((event: EventProps) => {
        let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        let time = `${event.startt[11]}${event.startt[12]}:${event.startt[14]}${event.startt[15]}`
        let hour = Number(event.startt[11]+event.startt[12])
        let ampm = (hour > 0 && hour <= 12) ? "am":"pm"

        let title = `${event.eventname} ${formattedStarttime}`

        let norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}1d`
        let englishTopic = `english${event.eventID}${(event.category).toLowerCase()}1d`

        let norwegianBody = `I morgen klokken ${time}! ${fetchEmoji(event)}`
        let englishBody = `Tomorrow at ${hour}${ampm}! ${fetchEmoji(event)}`
        
        if (norwegianTopic) sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic) sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 2 days away.
    notify2d.forEach((event: EventProps) => {
        let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        let time = `${event.startt[11]}${event.startt[12]}:${event.startt[14]}${event.startt[15]}`
        let hour = Number(event.startt[11]+event.startt[12])
        let ampm = (hour > 0 && hour <= 12) ? "am":"pm"

        let title = `${event.eventname} ${formattedStarttime}`

        let norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}2d`
        let englishTopic = `english${event.eventID}${(event.category).toLowerCase()}2d`

        let norwegianBody = `Overimorgen ${time}! ${fetchEmoji(event)}`
        let englishBody = `In 2 days at ${hour + ampm}! ${fetchEmoji(event)}`
        
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 1 week away.
    notify1w.forEach((event: EventProps) => {
        let formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`

        let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        let ukedager = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag']

        let year = event.startt[0] + event.startt[1] + event.startt[2] + event.startt[3]
        let month = event.startt[5] + event.startt[6]
        let day = event.startt[8] + event.startt[9]
        let time = `${event.startt[11]}${event.startt[12]}:${event.startt[14]}${event.startt[15]}`

        let hour = Number(event.startt[11]+event.startt[12])
        let ampm = (hour > 0 && hour <= 12) ? "am":"pm"
        
        let date = new Date(`${year}-${month}-${day}`)
        let ukedag = ukedager[date.getDay()]
        let weekday = weekdays[date.getDay()]
        
        let title = `${event.eventname} ${formattedStarttime}`
        
        let norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}1w`
        let englishTopic = `english${event.eventID}${(event.category).toLowerCase()}1w`
        
        let norwegianBody = `Neste ${ukedag} kl. ${time}! ${fetchEmoji(event)}`
        let englishBody = `Next ${weekday} at ${hour}${ampm}! ${fetchEmoji(event)}`

        if (norwegianTopic) sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic) sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Declaring new intervals
    let new10m: EventProps[] = []
    let new30m: EventProps[] = []
    let new1h: EventProps[] = []
    let new2h: EventProps[] = []
    let new3h: EventProps[] = []
    let new6h: EventProps[] = []
    let new1d: EventProps[] = []
    let new2d: EventProps[] = []
    let new1w: EventProps[] = []

    // Filters events to appropriate interval
    events.forEach(event => {
        const time = timeToEvent(event)

        if (time > 604800) new1w.push(event)
        else if (time <= 604800 && time > 172800) new2d.push(event)
        else if (time <= 172800 && time > 86400) new1d.push(event)
        else if (time <= 86400 && time > 21600) new6h.push(event)
        else if (time <= 21600 && time > 10800) new3h.push(event)
        else if (time <= 10800 && time > 7200) new2h.push(event)
        else if (time <= 7200 && time > 3600) new1h.push(event)
        else if (time <= 3600 && time > 1800) new30m.push(event)
        else if (time <= 1800 && time > 600) new10m.push(event)
    })

    // Stores events
    writeFile({fileName: "1w", content: new1w})
    writeFile({fileName: "2d", content: new2d})
    writeFile({fileName: "1d", content: new1d})
    writeFile({fileName: "6h", content: new6h})
    writeFile({fileName: "3h", content: new3h})
    writeFile({fileName: "2h", content: new2h})
    writeFile({fileName: "1h", content: new1h})
    writeFile({fileName: "30m", content: new30m})
    writeFile({fileName: "10m", content: new10m})

    // Logs the status for easy monitoring of the logs
    if (reminders)   console.log(`Scheduled ${reminders} reminders at ${new Date().toISOString()}`)
    else             console.log(`No reminders to be sent at this time ${new Date().toISOString()}`)
}
