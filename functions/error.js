import { detailedEvents, isStable, timeToEvent } from "./fetch.js";
import sendNotification from "./sendNotification.js";
import { readFile, writeFile } from "./file.js";
import sortEvents from "./sort.js";

/**
 * Function for handling errors and notifying maintenance crew.
 * 
 * @param {string} file File the error occured in
 * @param {string} error Error that occured
 * @param {string} topic Possibility to schedule to multiple topics in the future
 * 
 * @see sendNotification(...) Schedule notifications instantly
 * 
 * @returns {undefined}
 */
export default function handleError(file, error, topic) {
    // Sends a notification in the app containing the error to users with the
    // maintenance topic enabled.
    sendNotification(`Error in ${file}`, error, topic ? topic:"maintenance");

    // Terminates the program if it is not stable
    if (!isStable()) {
        console.log(`Terminated due to error in file: ${file}, ${error}`)
        process.exit(1);
    }

    // Otherwise returns undefined for the function that called handleError so
    // that it can continue succesfully.
    else return undefined
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
export async function heal(arg) {
    // Minutes elapsed since function was entered
    let minutesElapsed = 0; 

    // Console logs the file being healed, and at what time
    console.log(`Trying to heal ${arg} at ${new Date().toISOString()}`);

    // Notifies the maintenance team with file being healed, and time of error.
    sendNotification(`Trying to heal ${arg}`, `Unknown issue occured at ${new Date().toISOString()}`);

    // Boolean for if the issue has been fixed
    let issueFixed = false;

    // Defines the fix loop
    do {
        // 1 minute timeout after each time the function has run
        if(minutesElapsed) await new Promise(resolve => setTimeout(resolve, 60000));
    
        // Checks which file needs to be healed, as each file is healed in a
        // different way, tailored to the needs of that file.    
        switch(arg) {
            // Heals notified.txt
            case "notified": {
                // Defines notified events, and full list of events
                let notified = [];
                let events = await detailedEvents(1);

                // Notifies maintenance team that there is an error in heal.js,
                // saying that events are undefined in slow.txt
                if(!events) handleError("heal", `Unable to heal ${arg}, events is undefined`);

                // Sorts out events that should not be in notified.txt
                let obj = sortEvents(events);

                // Pushes all notified events to the notified array
                obj.notified.forEach(event => {notified.push(event)});

                // Writes notified array to file
                await writeFile(arg, notified);

                // Defines the fix variable equal to if the file was read successfully
                let fix = await readFile("notified");

                // If the file was read successfully the issue is likely resolved
                if (fix) issueFixed = true;

                // Otherwise notifies maintenance team that the file is still unreadable
                else handleError("heal", `Healing of ${arg} failed because the file is still unreadable.`);

                // Breaks the function as the next case is not relevant
                break;
            }

            // Heals slow.txt
            case "slow": {
                try {
                    // Defines slow events, and full list of events
                    let slow = [];
                    let events = await detailedEvents(1);
                    
                    // Notifies maintenance team that there is an error in 
                    // heal.mjs, saying that events are undefined in slow.txt
                    if(!events) handleError("heal", `Unable to heal ${arg}, events is undefined`);

                    // Sorts out events that should not be in slow.txt
                    let obj = sortEvents(events);

                    // Pushes all slow events to the slow array
                    obj.slow.forEach(event => {slow.push(event)});
                    
                    // Writes slow array to file
                    await writeFile(arg, slow);

                    // Defines the fix variable equal to if the file was written successfully
                    let fix = await readFile("slow");

                    // If the file was read successfully the issue is likely resolved
                    if (fix) issueFixed = true;

                    // Otherwise notifies maintenance team that the file is still unreadable
                    else handleError("heal", `Healing of ${arg} failed because the file is still unreadable.`);
                
                // Notifies maintenance team of any unknown errors
                } catch (error) {handleError("heal", error)}

                // Breaks the function as the next case is not relevant
                break;
            }

            case "info": {
                try {
                    await writeFile("info", { startTime: new Date().toISOString(), safe: false })
                } catch (error) {
                    handleError("heal", `Healing of ${arg} failed because the file is still unreadable.`);
                }

                break;
            }

            // Heals all interval files by default
            default: {
                // Fetches events
                let events = await detailedEvents(1);

                // Notifies maintenance team that interval files are unable to be healed
                if(!events) handleError("heal", `Unable to heal interval files, events is undefined`);

                // Declaring new intervals
                let new10m = [];
                let new30m = [];
                let new1h = [];
                let new2h = [];
                let new3h = [];
                let new6h = [];
                let new1d = [];
                let new2d = [];
                let new1w = [];

                // Filters events to appropriate interval
                events.forEach(event => {
                    // Defines time to event
                    const time = timeToEvent(event)

                    // Adds each event to the appropriate array
                    if(time > 604800) new1w.push(event);
                    else if (time <= 604800 && time > 172800) new2d.push(event);
                    else if (time <= 172800 && time > 86400) new1d.push(event);
                    else if (time <= 21600 && time > 10800) new3h.push(event);
                    else if (time <= 10800 && time > 7200) new2h.push(event);
                    else if (time <= 7200 && time > 3600) new1h.push(event);
                    else if (time <= 86400 && time > 21600) new6h.push(event);
                    else if (time <= 3600 && time > 1800) new30m.push(event);
                    else if (time <= 1800 && time > 600) new10m.push(event);
                });
    
                // Stores events in proper files
                await writeFile("1w", new1w);
                await writeFile("2d", new2d);
                await writeFile("1d", new1d);
                await writeFile("6h", new6h);
                await writeFile("3h", new3h);
                await writeFile("2h", new2h);
                await writeFile("1h", new1h);
                await writeFile("30m", new30m);
                await writeFile("10m", new10m);
            
                /**
                 * If the file is readable we view the issue as resolved. We
                 * could also check that the file is parsable, but if it is not
                 * parsable we will most likely be in an infinite loop where the
                 * file can never be healed. This solution will allow the other
                 * events to run successfully, only trying to heal the broken
                 * ones when necesarry.
                 */
                let fix = await readFile(arg);
                if (fix) issueFixed = true;

                // Otherwise notifies maintenance team that the file is still unreadable
                else handleError("heal", `Healing of ${arg} failed because the file is still unreadable. Attempt: ${minutesElapsed}. Trying again in 1 minute.`);
            };
        };

        // Notifies maintenance team of healing lasting 5 minutes, 10 minutes, and every 10 minutes afterwards
        if (minutesElapsed == 5 || (minutesElapsed >= 10 && minutesElapsed % 10 == 0)) handleError("heal", `Healing ${arg} for ${minutesElapsed} minutes unsuccessfully.`);
        
        // Increases minutes elapsed
        minutesElapsed++;
    
    // Continues till the issue is resolved
    } while (!issueFixed);

    // Notifies maintenance team of successful healing of file, and how many minutes elapsed
    sendNotification("heal.mjs", `Healing complete for ${arg} after ${minutesElapsed} ${minutesElapsed == 1 ? "minute":"minutes"}.`);

    // Logs that healing has completed for file, containing minutes elapsed
    console.log(`Healing complete for ${arg} at ${new Date().toISOString()} after running for ${minutesElapsed} minutes`);
};