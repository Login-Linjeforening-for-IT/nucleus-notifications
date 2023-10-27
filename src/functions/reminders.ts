import sendNotification from "./sendNotification.js"
import { readFile, writeFile } from "./file.js"
import { detailedEvents, timeToEvent } from "./fetch.js"
import handleError from "./error.js"
import { fetchEmoji } from "./fetch.js"

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
    const events = await detailedEvents(true)

    if (!events) return handleError({
        file: "reminders",
        error: "events is undefined"
    })

    // Fetches events in each interval
    const stored10m = await readFile("10m") as DetailedEventProps[]
    const stored30m = await readFile("30m") as DetailedEventProps[]
    const stored1h  = await readFile("1h") as DetailedEventProps[]
    const stored2h  = await readFile("2h") as DetailedEventProps[]
    const stored3h  = await readFile("3h") as DetailedEventProps[]
    const stored6h  = await readFile("6h") as DetailedEventProps[]
    const stored1d  = await readFile("1d") as DetailedEventProps[]
    const stored2d  = await readFile("2d") as DetailedEventProps[]
    const stored1w  = await readFile("1w") as DetailedEventProps[]

    // Filters out events that are ready to be notified about
    const notify10m = stored10m.filter((event: EventProps) => timeToEvent(event) <= 600)
    const notify30m = stored30m.filter((event: EventProps) => timeToEvent(event) <= 1800)
    const notify1h = stored1h.filter((event: EventProps) => timeToEvent(event) <= 3600)
    const notify2h = stored2h.filter((event: EventProps) => timeToEvent(event) <= 7200)
    const notify3h = stored3h.filter((event: EventProps) => timeToEvent(event) <= 10800)
    const notify6h = stored6h.filter((event: EventProps) => timeToEvent(event) <= 21600)
    const notify1d = stored1d.filter((event: EventProps) => timeToEvent(event) <= 86400)
    const notify2d = stored2d.filter((event: EventProps) => timeToEvent(event) <= 172800)
    const notify1w = stored1w.filter((event: EventProps) => timeToEvent(event) <= 604800)

    // Schedules notifications for events 10 minutes away
    notify10m.forEach((event: EventProps) => {
        const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        const title = `${event.eventname} ${formattedStarttime}`
        
        // Notification topic
        const norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}10m`
        const englishTopic = `english${event.eventID}${(event.category).toLowerCase()}10m`

        // Notification body
        const norwegianBody = `Begynner om 10 minutter! ${fetchEmoji(event)}`
        const englishBody = `Starts in 10 minutes! ${fetchEmoji(event)}`
        
        // Sends notifications
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})

        // Increases reminders sent
        reminders+=2
    })

    // Schedules notifications for events 30 minutes away
    notify30m.forEach((event: EventProps) => {
        const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        const title = `${event.eventname} ${formattedStarttime}`

        // Notification topic
        const norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}30m`
        const englishTopic = `english${event.eventID}${(event.category).toLowerCase()}30m`

        // Notification body
        const norwegianBody = `Begynner om 30 minutter! ${fetchEmoji(event)}`
        const englishBody = `Starts in 30 minutes! ${fetchEmoji(event)}`

        // Sends notifications
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})

        // Increases reminders sent
        reminders+=2
    })

    // Schedules notifications for events 1 hour away
    notify1h.forEach((event: EventProps) => {
        const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        const title = `${event.eventname} ${formattedStarttime}`

        const norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}1h`
        const englishTopic = `english${event.eventID}${(event.category).toLowerCase()}1h`

        const norwegianBody = `Begynner om 1 time! ${fetchEmoji(event)}`
        const englishBody = `Starts in 1 hour! ${fetchEmoji(event)}`
        
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 2 hours away
    notify2h.forEach((event: EventProps) => {
        const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        const title = `${event.eventname} ${formattedStarttime}`
        
        const norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}2h`
        const englishTopic = `english${event.eventID}${(event.category).toLowerCase()}2h`

        const norwegianBody = `Begynner om 2 timer! ${fetchEmoji(event)}`
        const englishBody = `Starts in 2 hours! ${fetchEmoji(event)}`

        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 3 hours away
    notify3h.forEach((event: EventProps) => {
        const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        const title = `${event.eventname} ${formattedStarttime}`

        const norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}3h`
        const englishTopic = `english${event.eventID}${(event.category).toLowerCase()}3h`

        const norwegianBody = `Begynner om 3 timer! ${fetchEmoji(event)}`
        const englishBody = `Starts in 3 hours! ${fetchEmoji(event)}`
        
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 6 hours away
    notify6h.forEach((event: EventProps) => {
        const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        const title = `${event.eventname} ${formattedStarttime}`

        const norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}6h`
        const englishTopic = `english${event.eventID}${(event.category).toLowerCase()}6h`

        const norwegianBody = `Begynner om 6 timer! ${fetchEmoji(event)}`
        const englishBody = `Starts in 6 hours! ${fetchEmoji(event)}`
        
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 1 day away.
    notify1d.forEach((event: EventProps) => {
        const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        const time = `${event.startt[11]}${event.startt[12]}:${event.startt[14]}${event.startt[15]}`
        const hour = Number(event.startt[11]+event.startt[12])
        const ampm = (hour > 0 && hour <= 12) ? "am":"pm"

        const title = `${event.eventname} ${formattedStarttime}`

        const norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}1d`
        const englishTopic = `english${event.eventID}${(event.category).toLowerCase()}1d`

        const norwegianBody = `I morgen klokken ${time}! ${fetchEmoji(event)}`
        const englishBody = `Tomorrow at ${hour}${ampm}! ${fetchEmoji(event)}`
        
        if (norwegianTopic) sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic) sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 2 days away.
    notify2d.forEach((event: EventProps) => {
        const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`
        const time = `${event.startt[11]}${event.startt[12]}:${event.startt[14]}${event.startt[15]}`
        const hour = Number(event.startt[11]+event.startt[12])
        const ampm = (hour > 0 && hour <= 12) ? "am":"pm"

        const title = `${event.eventname} ${formattedStarttime}`

        const norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}2d`
        const englishTopic = `english${event.eventID}${(event.category).toLowerCase()}2d`

        const norwegianBody = `Overimorgen ${time}! ${fetchEmoji(event)}`
        const englishBody = `In 2 days at ${hour + ampm}! ${fetchEmoji(event)}`
        
        if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic)    sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Schedules notifications for events 1 week away.
    notify1w.forEach((event: EventProps) => {
        const formattedStarttime = `${event.startt[8]}${event.startt[9]}.${event.startt[5]}${event.startt[6]}`

        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const ukedager = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag']

        const year = event.startt[0] + event.startt[1] + event.startt[2] + event.startt[3]
        const month = event.startt[5] + event.startt[6]
        const day = event.startt[8] + event.startt[9]
        const time = `${event.startt[11]}${event.startt[12]}:${event.startt[14]}${event.startt[15]}`

        const hour = Number(event.startt[11]+event.startt[12])
        const ampm = (hour > 0 && hour <= 12) ? "am":"pm"
        
        const date = new Date(`${year}-${month}-${day}`)
        const ukedag = ukedager[date.getDay()]
        const weekday = weekdays[date.getDay()]
        
        const title = `${event.eventname} ${formattedStarttime}`
        
        const norwegianTopic = `norwegian${event.eventID}${(event.category).toLowerCase()}1w`
        const englishTopic = `english${event.eventID}${(event.category).toLowerCase()}1w`
        
        const norwegianBody = `Neste ${ukedag} kl. ${time}! ${fetchEmoji(event)}`
        const englishBody = `Next ${weekday} at ${hour}${ampm}! ${fetchEmoji(event)}`

        if (norwegianTopic) sendNotification({title, body: norwegianBody, screen: event, topic: norwegianTopic})
        if (englishTopic) sendNotification({title, body: englishBody, screen: event, topic: englishTopic})
        reminders+=2
    })

    // Declaring new intervals
    const new10m: EventProps[] = []
    const new30m: EventProps[] = []
    const new1h: EventProps[] = []
    const new2h: EventProps[] = []
    const new3h: EventProps[] = []
    const new6h: EventProps[] = []
    const new1d: EventProps[] = []
    const new2d: EventProps[] = []
    const new1w: EventProps[] = []

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
