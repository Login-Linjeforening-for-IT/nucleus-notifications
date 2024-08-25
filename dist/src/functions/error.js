var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { detailedEvents, fetchAdDetails, fetchAds, timeToEvent } from "./fetch.js";
import sendNotification from "./sendNotification.js";
import { readFile, writeFile } from "./file.js";
import sortEvents from "./sort.js";
import { removeHealthyFile } from "./file.js";
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
export default function handleError({ file, error, topic }) {
    // Removes healthy file indicating that the service is no longer healthy and should be restarted
    removeHealthyFile();
    // Checks if the error is a SyntaxError
    if (error instanceof SyntaxError) {
        // @ts-expect-error
        console.error("SyntaxError details:", error.message, "at position", error.position);
        // @ts-expect-error
        sendNotification({ title: `SyntaxError in ${file}`, body: `Name: ${error.name}, Message: ${error}, Position: ${error.position}, Stack: ${error.stack}`, topic: topic ? topic : "maintenance" });
    }
    else if (typeof error === "string") {
        console.error(`Error in ${file}:`, error);
    }
    else {
        // @ts-expect-error
        console.error(`Error in ${file}`, `Name: ${error.name}, Message: ${error}, Stack: ${error.stack}`);
        // Sends a notification in the app containing the error to users with the
        // maintenance topic enabled.
        // @ts-expect-error
        sendNotification({ title: `Error in ${file}`, body: `Name: ${error.name}, Message: ${error}, Stack: ${error.stack}`, topic: topic ? topic : "maintenance" });
    }
    // Continues with undefined to try executing the rest of the file
    if (stable)
        return undefined;
    // Terminates the program if it is not stable
    console.log(`Terminated due to error in file: ${file}, ${error}`);
    process.exit(1);
}
/**
 * Function for resolving json issues that may occur due to any type of bug.
 *
 * This function will run until resolved, as it is trying to fix a critical
 * error that has to be resolved for the project to work. Notifies maintenance
 * team and keeps track of time for better knowledge of how long the situation
 * has been ongoing.
 *
 * @param {string} arg File with malformed json content
 *
 * @see sendNotification(...)   Schedule notifications instantly
 * @see detailedEvents(...)     Fetches details for events
 * @see handleError(...)        Notifies maintenance team of errors
 * @see timeToEvent(...)        Fetches the time till event
 * @see sortEvents(...)         Sorts events into events, slow and notified
 * @see writeFile(...)          Writes events to file
 * @see readFile(...)           Reads events from file
 */
export function fixJSONContent(arg, error) {
    return __awaiter(this, void 0, void 0, function* () {
        // Minutes elapsed since function was entered
        let minutesElapsed = 0;
        // Console logs the file with malformed json content, and the current time
        console.log(`Trying to fix malformed json content in ${arg} at ${new Date().toISOString()}\nError: ${error}`);
        // Notifies the maintenance team with file that has malformed json content, and the current time
        sendNotification({ title: `Trying to fix malformed json in ${arg}`, body: `Failed to parse json content in ${arg} at ${new Date().toISOString()}\nError: ${error}` });
        // Boolean for if the issue has been fixed
        let issueFixed = false;
        // Defines the fix loop
        do {
            // 1 minute timeout after each time the function has run
            if (minutesElapsed)
                yield new Promise(resolve => setTimeout(resolve, 60000));
            // Checks which file has malformed json input, as each file can be
            // fixed in different ways, tailored to the function of that file.    
            switch (arg) {
                // Fixes malformed json content in notified.json
                case "notified": {
                    // Defines notified events, and full list of events
                    const notified = [];
                    const events = yield detailedEvents(true);
                    // Notifies maintenance team that there is an error in error.ts,
                    // saying that events are undefined in slow.json
                    if (!events)
                        handleError({ file: "error.ts", error: `Unable to fix json content in ${arg}, events is undefined` });
                    // Sorts out events that should not be in notified.json
                    const obj = sortEvents({ events });
                    // Pushes all notified events to the notified array
                    obj.notified.forEach((event) => { notified.push(event); });
                    // Writes notified array to file
                    writeFile({ fileName: arg, content: notified });
                    // Defines the fix variable equal to if the file was read successfully
                    const fix = yield readFile("notified");
                    // If the file was read successfully the issue is likely resolved
                    if (fix)
                        issueFixed = true;
                    // Otherwise notifies maintenance team that the file is still unreadable
                    else
                        handleError({ file: "error.ts", error: `Fixing malformed json content in ${arg} failed because the file is still unreadable. Attempt: ${minutesElapsed}. Trying again in 1 minute.` });
                    // Breaks the function as the next case is not relevant
                    break;
                }
                // Fixes malformed json content in slow.json
                case "slow": {
                    try {
                        // Defines slow events, and full list of events
                        const slow = [];
                        const events = yield detailedEvents(true);
                        // Notifies maintenance team that there is an error in 
                        // error.ts, saying that events are undefined in slow.json
                        if (!events)
                            handleError({
                                file: "error.ts",
                                error: `Unable to fix malformed json content in ${arg}, events is undefined`
                            });
                        // Sorts out events that should not be in slow.json
                        const obj = sortEvents({ events });
                        // Pushes all slow events to the slow array
                        obj.slow.forEach(event => { slow.push(event); });
                        // Writes slow array to file
                        writeFile({ fileName: arg, content: slow });
                        // Defines the fix variable equal to if the file was written successfully
                        const fix = yield readFile("slow");
                        // If the file was read successfully the issue is likely resolved
                        if (fix)
                            issueFixed = true;
                        // Otherwise notifies maintenance team that the file is still unreadable
                        else
                            handleError({ file: "error.ts", error: `Fixing malformed json content in ${arg} failed because the file is still unreadable. Attempt: ${minutesElapsed}. Trying again in 1 minute.` });
                        // Notifies maintenance team of any unknown errors
                    }
                    catch (error) {
                        handleError({ file: "error.ts", error: error });
                    }
                    // Breaks the function as the next case is not relevant
                    break;
                }
                // Fixes all interval files by default
                default: {
                    // Fetches events
                    const events = yield detailedEvents(true);
                    // Fetches ads
                    const APIundetailedAds = yield fetchAds();
                    const APIads = [];
                    for (const ad of APIundetailedAds) {
                        const response = yield fetchAdDetails(ad);
                        if (response) {
                            APIads.push(response);
                        }
                    }
                    // Notifies maintenance team that interval files with malformed json content are unfixable
                    if (!events)
                        handleError({
                            file: "error.ts",
                            error: `Unable to fix malformed json in interval files, events is undefined`
                        });
                    // Declaring new intervals events
                    const new10m = [];
                    const new30m = [];
                    const new1h = [];
                    const new2h = [];
                    const new3h = [];
                    const new6h = [];
                    const new1d = [];
                    const new2d = [];
                    const new1w = [];
                    // Declaring new intervals for ads
                    const newA2H = [];
                    const newA6H = [];
                    const newA24H = [];
                    // Filters events to appropriate interval
                    events.forEach(event => {
                        // Defines time to event
                        const time = timeToEvent(event);
                        // Adds each event to the appropriate array
                        if (time > 604800)
                            new1w.push(event);
                        else if (time <= 604800 && time > 172800)
                            new2d.push(event);
                        else if (time <= 172800 && time > 86400)
                            new1d.push(event);
                        else if (time <= 21600 && time > 10800)
                            new3h.push(event);
                        else if (time <= 10800 && time > 7200)
                            new2h.push(event);
                        else if (time <= 7200 && time > 3600)
                            new1h.push(event);
                        else if (time <= 86400 && time > 21600)
                            new6h.push(event);
                        else if (time <= 3600 && time > 1800)
                            new30m.push(event);
                        else if (time <= 1800 && time > 600)
                            new10m.push(event);
                    });
                    APIads.forEach(ad => {
                        // Defines time to event
                        const time = timeToEvent(ad);
                        // Adds each event to the appropriate array
                        if (time <= 172800 && time > 86400)
                            newA24H.push(ad);
                        else if (time <= 10800 && time > 7200)
                            newA2H.push(ad);
                        else if (time <= 86400 && time > 21600)
                            newA6H.push(ad);
                    });
                    // Stores events in proper files
                    writeFile({ fileName: "1w", content: new1w });
                    writeFile({ fileName: "2d", content: new2d });
                    writeFile({ fileName: "1d", content: new1d });
                    writeFile({ fileName: "6h", content: new6h });
                    writeFile({ fileName: "3h", content: new3h });
                    writeFile({ fileName: "2h", content: new2h });
                    writeFile({ fileName: "1h", content: new1h });
                    writeFile({ fileName: "30m", content: new30m });
                    writeFile({ fileName: "10m", content: new10m });
                    /**
                     * If the file is readable we view the issue as resolved. We
                     * could also check that the file is parsable, but if it is not
                     * parsable we will most likely be in an infinite loop where the
                     * malformed json content can never be fixed. This solution will
                     * allow the other events to run successfully, only trying to
                     * fix the broken ones when necesarry.
                     */
                    const fix = yield readFile(arg);
                    if (fix)
                        issueFixed = true;
                    // Otherwise notifies maintenance team that the file is still unparsable
                    else
                        handleError({
                            file: "error.ts",
                            error: `Fixing malformed json content in ${arg} failed because the file is still unreadable. Attempt: ${minutesElapsed}. Trying again in 1 minute.`
                        });
                }
            }
            // Notifies maintenance team of malformed json file lasting 5 minutes, 10 minutes, and every 10 minutes afterwards
            if (minutesElapsed == 5 || (minutesElapsed >= 10 && minutesElapsed % 10 == 0))
                handleError({
                    file: "error.ts",
                    error: `Trying to fix malformed json content in ${arg} for ${minutesElapsed} minutes unsuccessfully.`
                });
            // Increases minutes elapsed
            minutesElapsed++;
            // Continues till the issue is resolved
        } while (!issueFixed);
        // Info about the time it took to fix the malformed json content
        const body = `Fixed malformed json content in ${arg} ${minutesElapsed <= 1 ? 'in less than a minute.' : `after ${minutesElapsed} minutes.`}`;
        sendNotification({ title: "error.ts", body });
    });
}
