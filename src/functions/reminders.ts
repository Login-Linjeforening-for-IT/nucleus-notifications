import sendNotification from "./sendNotification.js"
import { readFile, writeFile } from "./file.js"
import { detailedEvents, timeToEvent } from "./fetch.js"
import handleError from "./error.js"
import { fetchEmoji } from "./fetch.js"

type ReminderProps = {
    event: DetailedEvent
    counter: number
    textNO: string
    textEN: string
    suffix: string
}

/**
 * Schedules a notification to FCM if a new event with a join link already available has been found and updates slowMonitored.json
 * 
 * @see sendNotification(...)   Schedules a notification to FCM
 * @see readFile(...)           Reads from given file
 * @see timeToEvent(...)        Returns the time to event
 * @see fetchEmoji(...)         Fetches a relevant emoji for the event
 * @see writeFile(...)          Writes given content to given file
 */
export default async function reminders() {
    let reminders = 0
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const ukedager = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag']

    // Fetches details for all events unfiltered.
    const events = await detailedEvents(true)

    if (!events) return handleError({
        file: "reminders",
        error: "events is undefined"
    })

    // Fetches events in each interval
    const stored10m = await readFile("10m") as DetailedEvent[]
    const stored30m = await readFile("30m") as DetailedEvent[]
    const stored1h  = await readFile("1h") as DetailedEvent[]
    const stored2h  = await readFile("2h") as DetailedEvent[]
    const stored3h  = await readFile("3h") as DetailedEvent[]
    const stored6h  = await readFile("6h") as DetailedEvent[]
    const stored1d  = await readFile("1d") as DetailedEvent[]
    const stored2d  = await readFile("2d") as DetailedEvent[]
    const stored1w  = await readFile("1w") as DetailedEvent[]

    // Filters out events that are ready to be notified about
    const notify10m = stored10m.filter((event: DetailedEvent) => timeToEvent(event) <= 600)
    const notify30m = stored30m.filter((event: DetailedEvent) => timeToEvent(event) <= 1800)
    const notify1h = stored1h.filter((event: DetailedEvent) => timeToEvent(event) <= 3600)
    const notify2h = stored2h.filter((event: DetailedEvent) => timeToEvent(event) <= 7200)
    const notify3h = stored3h.filter((event: DetailedEvent) => timeToEvent(event) <= 10800)
    const notify6h = stored6h.filter((event: DetailedEvent) => timeToEvent(event) <= 21600)
    const notify1d = stored1d.filter((event: DetailedEvent) => timeToEvent(event) <= 86400)
    const notify2d = stored2d.filter((event: DetailedEvent) => timeToEvent(event) <= 172800)
    const notify1w = stored1w.filter((event: DetailedEvent) => timeToEvent(event) <= 604800)

    // Schedules notifications for events 10 minutes away
    notify10m.forEach((event: DetailedEvent) => {
        schedule({event, counter: reminders, textNO: "Begynner om 10 minutter!", textEN: "Starts in 10 minutes!", suffix: "10m"})
    })

    // Schedules notifications for events 30 minutes away
    notify30m.forEach((event: DetailedEvent) => {
        schedule({event, counter: reminders, textNO: "Begynner om 30 minutter!", textEN: "Starts in 30 minutes!", suffix: "30m"})
    })

    // Schedules notifications for events 1 hour away
    notify1h.forEach((event: DetailedEvent) => {
        schedule({event, counter: reminders, textNO: "Begynner om 1 time!", textEN: "Starts in 1 hour!", suffix: "1h"})
    })

    // Schedules notifications for events 2 hours away
    notify2h.forEach((event: DetailedEvent) => {
        schedule({event, counter: reminders, textNO: "Begynner om 2 timer!", textEN: "Starts in 2 hours!", suffix: "2h"})
    })

    // Schedules notifications for events 3 hours away
    notify3h.forEach((event: DetailedEvent) => {
        schedule({event, counter: reminders, textNO: "Begynner om 3 timer!", textEN: "Starts in 3 hours!", suffix: "3h"})
    })

    // Schedules notifications for events 6 hours away
    notify6h.forEach((event: DetailedEvent) => {
        schedule({event, counter: reminders, textNO: "Begynner om 6 timer!", textEN: "Starts in 6 hours!", suffix: "6h"})
    })

    // Schedules notifications for events 1 day away.
    notify1d.forEach((event: DetailedEvent) => {
        const time = `${event.time_start[11]}${event.time_start[12]}:${event.time_start[14]}${event.time_start[15]}`
        const hour = Number(event.time_start[11]+event.time_start[12])
        const ampm = (hour > 0 && hour <= 12) ? "am":"pm"
        schedule({event, counter: reminders, textNO: `I morgen klokken ${time}!`, textEN: `Tomorrow at ${hour}${ampm}!`, suffix: "1d"})
    })

    // Schedules notifications for events 2 days away.
    notify2d.forEach((event: DetailedEvent) => {
        const time = `${event.time_start[11]}${event.time_start[12]}:${event.time_start[14]}${event.time_start[15]}`
        const hour = Number(event.time_start[11]+event.time_start[12])
        const ampm = (hour > 0 && hour <= 12) ? "am":"pm"
        schedule({event, counter: reminders, textNO: `Overimorgen ${time}!`, textEN: `In 2 days at ${hour}${ampm}!`, suffix: "2d"})
    })

    // Schedules notifications for events 1 week away.
    notify1w.forEach((event: DetailedEvent) => {
        const year = event.time_start[0] + event.time_start[1] + event.time_start[2] + event.time_start[3]
        const month = event.time_start[5] + event.time_start[6]
        const day = event.time_start[8] + event.time_start[9]
        const time = `${event.time_start[11]}${event.time_start[12]}:${event.time_start[14]}${event.time_start[15]}`
        const hour = Number(event.time_start[11]+event.time_start[12])
        const ampm = (hour > 0 && hour <= 12) ? "am":"pm"
        const date = new Date(`${year}-${month}-${day}`)
        const ukedag = ukedager[date.getDay()]
        const weekday = weekdays[date.getDay()]
        schedule({event, counter: reminders, textNO: `Neste ${ukedag} kl. ${time}!`, textEN: `Next ${weekday} at ${hour}${ampm}!`, suffix: "1w"})
    })

    // Declaring new intervals
    const new10m: DetailedEvent[] = []
    const new30m: DetailedEvent[] = []
    const new1h: DetailedEvent[] = []
    const new2h: DetailedEvent[] = []
    const new3h: DetailedEvent[] = []
    const new6h: DetailedEvent[] = []
    const new1d: DetailedEvent[] = []
    const new2d: DetailedEvent[] = []
    const new1w: DetailedEvent[] = []

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
    if (!reminders) {
        return console.log(`No reminders to be sent at this time ${new Date().toISOString()}`)
    }

    console.log(`Scheduled ${reminders} reminders at ${new Date().toISOString()}`)
}

function schedule({event, counter, textNO, textEN, suffix}: ReminderProps) {
    const formattedStarttime = `${event.time_start[8]}${event.time_start[9]}.${event.time_start[5]}${event.time_start[6]}`
    const name_no = `${event.name_no} ${formattedStarttime}`
    const name_en = `${event.name_en} ${formattedStarttime}`
    
    // Notification topic
    const norwegianTopic = `n${event.id}${(event.category_name_no).toLowerCase()}${suffix}`
    const englishTopic = `e${event.id}${(event.category_name_en).toLowerCase()}${suffix}`

    // Notification body
    const norwegianBody = `${textNO} ${fetchEmoji(event)}`
    const englishBody = `${textEN} ${fetchEmoji(event)}`
    
    // Sends notifications
    if (norwegianTopic) sendNotification({title: name_no, body: norwegianBody, screen: event, topic: norwegianTopic})
    if (englishTopic)   sendNotification({title: name_en, body: englishBody, screen: event, topic: englishTopic})

    // Increases reminders sent
    counter += 2
}
