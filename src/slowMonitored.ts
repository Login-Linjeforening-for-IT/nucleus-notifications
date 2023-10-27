import { storeSlowMonitored } from "./functions/store.js"
import sendNotification from "./functions/sendNotification.js"
import { detailedEvents } from "./functions/fetch.js"
import joinlink from "./functions/joinlink.js"
import { readFile } from "./functions/file.js"

/**
 * **Slow monitored event notifications**
 * 
 * Monitors events where changes are unlikely at a larger interval to save 
 * computational resources
 * 
 * - Fetches API
 * - Monitors events every 30 minutes
 * - Schedules notifications on changes
 * 
 * @see storeSlowMonitored(...)     Stores events in file after all checks are completed
 * @see detailedEvents(...)         Returns all information about all events
 * @see joinlink(...)               Fetches the joinlink of an event
 * @see sendNotification(...)       Sends notification on change
 * @see readFile(...)               Reads content from given file
 */
export default async function slowMonitored() {
    console.log("Slow monitoring every 30 minutes")

    // Fetches events from file and API
    const APIevents = await detailedEvents(true)
    const slowEvents = await readFile("slow") as DetailedEventProps[]

    // Checks all events with earlier version for potential changes
    for (const APIevent of APIevents) {
        const slow = slowEvents.find((event: EventProps) => event.eventID === APIevent.eventID)
        // Defines norwegian topic
        const norwegianTopic = `norwegian${APIevent.eventID}`
        // Defines english topic
        const englishTopic = `english${APIevent.eventID}`
        // Boolean for if the event has a time
        let time = false
        // Boolean for if the event has a link
        let link = false
        // Boolean for if the event has a location
        let location = false
        // Formats date of the event
        const formattedStarttime = `${APIevent.startt[8]}${APIevent.startt[9]}.${APIevent.startt[5]}${APIevent.startt[6]}`
        // Sets title
        const title = `${APIevent.eventname} ${formattedStarttime}`
        // Variable for roomnumber of the event
        const room = APIevent.roomno
        // Variable for campus of the event
        const campus = APIevent.campus
        // Variable for street address of the event
        const street = APIevent.street
        // Variable for full location of the event
        let loc
        // Formats hour of the event
        const hour = `${APIevent.startt[11]}${APIevent.startt[12]}:${APIevent.startt[14]}${APIevent.startt[15]}`

        // Updates time of the event
        if (slow && slow.startt !== APIevent.startt)             time = true
        if (slow && joinlink(slow) !== joinlink(APIevent))       link = true

        // Updates event location variables
        if (slow && slow.roomno !== APIevent.roomno)         location = true
        if (slow && slow.campus !== APIevent.campus)         location = true
        if (slow && slow.street !== APIevent.street)         location = true

        // Updates link of the event
        if (!joinlink(APIevent)) link = false

        // Updates full location of the event
        if (room && campus && street)   loc = `${room}, ${campus}, ${street}.`
        else if (room && campus)        loc = `${room}, ${campus}.`
        else if (room && street)        loc = `${room}, ${street}.`
        else if (campus && street)      loc = `${campus}, ${street}.`
        else if (room)                  loc = `${room}.`
        else if (campus)                loc = `${campus}.`
        else if (street)                loc =`${street}.`
        else                            loc = null

        // Sends the relevant notification to the relevant topics with the relevant information
        if (time && link && location) {
            const norwegianBody = `Arrangementet har blitt endret. Ny tid: ${hour} den ${formattedStarttime}. Nytt sted: ${loc}. Trykk her for alle detaljene.`
            const englishBody = `Event has changed. New time: ${hour} on ${formattedStarttime}. New location: ${loc}. Tap here for details.`

            if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: APIevent, topic: norwegianTopic})
            if (englishTopic)    sendNotification({title, body: englishBody, screen: APIevent, topic: englishTopic})

        }else if (time && link){
            const norwegianBody = `Tid endret til kl: ${hour} den ${formattedStarttime}. Påmeldingslinken er også endret. Trykk her for flere detaljer.`
            const englishBody = `Time changed to: ${hour} on ${formattedStarttime}. Registration link has also changed. Tap here for details.`

            if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: APIevent, topic: norwegianTopic})
            if (englishTopic)    sendNotification({title, body: englishBody, screen: APIevent, topic: englishTopic})
           
        }else if (time && location) {
            const norwegianBody = `Tid og sted endret. Ny tid: ${hour} den ${formattedStarttime}. Nytt sted: ${loc}. Trykk her for å se den oppdaterte informasjonen.`
            const englishBody = `Time and location changed. New time: ${hour} on ${formattedStarttime}. New location: ${loc}. Tap here for details.`

            if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: APIevent, topic: norwegianTopic})
            if (englishTopic)    sendNotification({title, body: englishBody, screen: APIevent, topic: englishTopic})
          
        }else if (link && location) {
            const norwegianBody = `Nytt sted: ${loc}. Påmeldingslink har også blitt endret. Trykk her for mer informasjon.`
            const englishBody = `New location: ${loc}. Registration link has also changed. Click here for more information.`

            if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: APIevent, topic: norwegianTopic})
            if (englishTopic)    sendNotification({title, body: englishBody, screen: APIevent, topic: englishTopic})
        
        }else if (time) {
            const norwegianBody = `Tidspunkt endret til kl ${hour} den ${formattedStarttime}.`
            const englishBody = `Time changed to ${hour} on ${formattedStarttime}.`

            if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: APIevent, topic: norwegianTopic})
            if (englishTopic)    sendNotification({title, body: englishBody, screen: APIevent, topic: englishTopic})
           
        }else if (location) {
            const norwegianBody = `Sted endret til ${loc}`
            const englishBody = `Location changed to ${loc}`

            if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: APIevent, topic: norwegianTopic})
            if (englishTopic)    sendNotification({title, body: englishBody, screen: APIevent, topic: englishTopic})

        }else if (link) {
            const norwegianBody = `Ny påmeldingslink lagt ut!`
            const englishBody = `New registration link available!`

            if (norwegianTopic)  sendNotification({title, body: norwegianBody, screen: APIevent, topic: norwegianTopic})
            if (englishTopic)    sendNotification({title, body: englishBody, screen: APIevent, topic: englishTopic})

        }
    }

    // Defines the new array of events to be slowmonitored
    let newSlow = APIevents.filter((api: EventProps) => (slowEvents.some((slow: 
        EventProps) => slow.eventID === api.eventID)))
    
    // Logs the length of the new array
    console.log("newslow", newSlow.length)
    
    // Overwrites slowMonitored.txt after checking for changes.
    if (newSlow.length > 0) storeSlowMonitored({events: newSlow, overwrite: true})
    // Otherwise logs that there are no events in api.
    else console.log("Found nothing new.")

}
