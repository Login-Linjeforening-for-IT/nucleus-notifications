import { detailedEvents, timeToEvent } from "./fetch.js"
import sendNotification from "./sendNotification.js"
import { readFile, writeFile } from "./file.js"
import sortEvents from "./sort.js"
import { stable } from "../data/info.js"

type handleErrorProps = {
    file: string
    error: string
    topic?: string
}

/**
 * Function for handling errors and notifying maintenance crew.
 * 
 * @param file File the error occured in
 * @param error Error that occured
 * @param topic Possibility to schedule to multiple topics in the future
 * 
 * @see sendNotification(...) Schedule notifications instantly
 * 
 * @returns {undefined}
 */
export default function handleError({file, error, topic}: handleErrorProps): undefined {
    // Sends a notification in the app containing the error to users with the
    // maintenance topic enabled.
    sendNotification({title: `Error in ${file}`, body: error, topic: topic ? topic : "maintenance"})

    // Continues with undefined to try executing the rest of the file
    if (stable) return undefined

    // Terminates the program if it is not stable
    console.log(`Terminated due to error in file: ${file}, ${error}`)
    process.exit(1)
}

/**
 * Function for healing JSON issues that may occur due to any type of bug.
 *  
 * This function will run until resolved, as it is trying to fix a critical
 * error that has to be resolved for the project to work. Notifies maintenance
 * team and keeps track of time for better knowledge of how long the situation
 * has been ongoing.
 * 
 * @param {string} arg File to heal
 * 
 * @see sendNotification(...)   Schedule notifications instantly
 * @see detailedEvents(...)     Fetches details for events
 * @see handleError(...)        Notifies maintenance team of errors
 * @see timeToEvent(...)        Fetches the time till event
 * @see sortEvents(...)         Sorts events into events, slow and notified
 * @see writeFile(...)          Writes events to file
 * @see readFile(...)           Reads events from file
 */
export async function heal(arg: string) {
    // Minutes elapsed since function was entered
    let minutesElapsed = 0 

    // Console logs the file being healed, and at what time
    console.log(`Trying to heal ${arg} at ${new Date().toISOString()}`)

    // Notifies the maintenance team with file being healed, and time of error.
    sendNotification({title: `Trying to heal ${arg}`, body: `Unknown issue occured at ${new Date().toISOString()}`})

    // Boolean for if the issue has been fixed
    let issueFixed = false

    // Defines the fix loop
    do {
        // 1 minute timeout after each time the function has run
        if (minutesElapsed) await new Promise(resolve => setTimeout(resolve, 60000))
    
        // Checks which file needs to be healed, as each file is healed in a
        // different way, tailored to the needs of that file.    
        switch(arg) {
            // Heals notified.txt
            case "notified": {
                // Defines notified events, and full list of events
                const notified: DetailedEvent[] = []
                const events = await detailedEvents(true)

                // Notifies maintenance team that there is an error in heal.ts,
                // saying that events are undefined in slow.txt
                if (!events) handleError({file: "heal", error: `Unable to heal ${arg}, events is undefined`})

                // Sorts out events that should not be in notified.txt
                const obj = sortEvents({events})

                // Pushes all notified events to the notified array
                obj.notified.forEach((event: DetailedEvent) => {notified.push(event)})

                // Writes notified array to file
                writeFile({fileName: arg, content: notified})

                // Defines the fix variable equal to if the file was read successfully
                const fix = await readFile("notified")

                // If the file was read successfully the issue is likely resolved
                if (fix) issueFixed = true

                // Otherwise notifies maintenance team that the file is still unreadable
                else handleError({file: "heal", error: `Healing of ${arg} failed because the file is still unreadable.`})

                // Breaks the function as the next case is not relevant
                break
            }

            // Heals slow.txt
            case "slow": {
                try {
                    // Defines slow events, and full list of events
                    const slow: DetailedEvent[] = []
                    const events = await detailedEvents(true)
                    
                    // Notifies maintenance team that there is an error in 
                    // heal.mjs, saying that events are undefined in slow.txt
                    if (!events) handleError({
                        file: "heal", 
                        error: `Unable to heal ${arg}, events is undefined`
                    })

                    // Sorts out events that should not be in slow.txt
                    const obj = sortEvents({events})

                    // Pushes all slow events to the slow array
                    obj.slow.forEach(event => {slow.push(event)})
                    
                    // Writes slow array to file
                    writeFile({fileName: arg, content: slow})

                    // Defines the fix variable equal to if the file was written successfully
                    const fix = await readFile("slow")

                    // If the file was read successfully the issue is likely resolved
                    if (fix) issueFixed = true

                    // Otherwise notifies maintenance team that the file is still unreadable
                    else handleError({file: "heal", error: `Healing of ${arg} failed because the file is still unreadable.`})
                
                // Notifies maintenance team of any unknown errors
                } catch (error) {handleError({file: "heal", error: JSON.stringify(error)})}

                // Breaks the function as the next case is not relevant
                break
            }

            case "info": {
                try {
                    // Writes startTime to file
                    const content = `const startTime = "${new Date().toISOString()}"\n\nexport default startTime`
                    writeFile({fileName: "info", content, removeBrackets: true})
                } catch (error) {
                    handleError({file: "heal", error: `Healing of ${arg} failed because the file is still unreadable.`})
                }

                break
            }

            // Heals all interval files by default
            default: {
                // Fetches events
                const events = await detailedEvents(true)

                // Notifies maintenance team that interval files are unable to be healed
                if (!events) handleError({
                    file: "heal", 
                    error: `Unable to heal interval files, events is undefined`
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
                    // Defines time to event
                    const time = timeToEvent(event)

                    // Adds each event to the appropriate array
                    if (time > 604800) new1w.push(event)
                    else if (time <= 604800 && time > 172800) new2d.push(event)
                    else if (time <= 172800 && time > 86400) new1d.push(event)
                    else if (time <= 21600 && time > 10800) new3h.push(event)
                    else if (time <= 10800 && time > 7200) new2h.push(event)
                    else if (time <= 7200 && time > 3600) new1h.push(event)
                    else if (time <= 86400 && time > 21600) new6h.push(event)
                    else if (time <= 3600 && time > 1800) new30m.push(event)
                    else if (time <= 1800 && time > 600) new10m.push(event)
                })
    
                // Stores events in proper files
                writeFile({fileName: "1w", content: new1w})
                writeFile({fileName: "2d", content: new2d})
                writeFile({fileName: "1d", content: new1d})
                writeFile({fileName: "6h", content: new6h})
                writeFile({fileName: "3h", content: new3h})
                writeFile({fileName: "2h", content: new2h})
                writeFile({fileName: "1h", content: new1h})
                writeFile({fileName: "30m", content: new30m})
                writeFile({fileName: "10m", content: new10m})
            
                /**
                 * If the file is readable we view the issue as resolved. We
                 * could also check that the file is parsable, but if it is not
                 * parsable we will most likely be in an infinite loop where the
                 * file can never be healed. This solution will allow the other
                 * events to run successfully, only trying to heal the broken
                 * ones when necesarry.
                 */
                const fix = await readFile(arg)
                if (fix) issueFixed = true

                // Otherwise notifies maintenance team that the file is still unreadable
                else handleError({
                    file: "heal", 
                    error: `Healing of ${arg} failed because the file is still unreadable. Attempt: ${minutesElapsed}. Trying again in 1 minute.`
                })
            }
        }

        // Notifies maintenance team of healing lasting 5 minutes, 10 minutes, and every 10 minutes afterwards
        if (minutesElapsed == 5 || (minutesElapsed >= 10 && minutesElapsed % 10 == 0)) handleError({
            file: "heal", 
            error: `Healing ${arg} for ${minutesElapsed} minutes unsuccessfully.`
        })
        
        // Increases minutes elapsed
        minutesElapsed++
    
    // Continues till the issue is resolved
    } while (!issueFixed)

    // Notifies maintenance team of successful healing of file, and how many minutes elapsed
    sendNotification({
        title: "heal.mjs", 
        body: `Healing complete for ${arg} after ${minutesElapsed} ${minutesElapsed == 1 ? "minute":"minutes"}.`
    })

    // Logs that healing has completed for file, containing minutes elapsed
    console.log(`Healing complete for ${arg} at ${new Date().toISOString()} after running for ${minutesElapsed} minutes`)
}
