import sendNotification from "./sendNotification.mjs";
import detailedEvents from "./detailedEvents.mjs";
import handleError from "./handleError.mjs";
import currentTime from "./currentTime.mjs";
import timeToEvent from "./timeToEvent.mjs";
import sortEvents from "./sortEvents.mjs";
import writeFile from "./writeFile.mjs";
import readFile from "./readFile.mjs";
import sleep from "./sleep.mjs";
import file from "./file.mjs";

export default async function heal(arg) {
    let counter = 0; 

    console.log(`Trying to heal ${arg} at ${currentTime()}`);
    sendNotification(`Trying to heal ${arg}`, `Unknown issue occured at ${currentTime()}`);

    let f = file(arg);
    let res = false;

    do{
        if(counter) await sleep(60000);
        
        switch(arg) {
            case "notified": {
                let notified = [];
                let events = await detailedEvents(1);
                if(!events) handleError("heal.mjs", `Unable to heal ${arg}, events is undefined`);

                let obj = sortEvents(events);
                obj.notified.forEach(event => {notified.push(event)});

                await writeFile(f, notified);

                let fix = await readFile("notified");
                if (fix) res = true;
                else handleError("heal.mjs", `Healing of ${arg} failed because the file is still unreadable.`);
                break;
            }
            case "slow": {
                try {
                    let slow = [];
                    let events = await detailedEvents(1);
                    if(!events) handleError("heal.mjs", `Unable to heal ${arg}, events is undefined`);

                    let obj = sortEvents(events);
                    obj.slow.forEach(event => {slow.push(event)});
                    
                    await writeFile(f, slow);

                    let fix = await readFile("slow");
                    if (fix) res = true;
                    else handleError("heal.mjs", `Healing of ${arg} failed because the file is still unreadable.`);
                } catch (e) {handleError("heal.mjs", e)}
                console.log("Healing slow");
                break;
            }
            default: {
                let events = await detailedEvents(1);
                if(!events) handleError("heal.mjs", `Unable to heal ${arg}, events is undefined`);

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
                    if(timeToEvent(event) > 604800) new1w.push(event);
                    else if (timeToEvent(event) <= 604800 && timeToEvent(event) > 172800) new2d.push(event);
                    else if (timeToEvent(event) <= 172800 && timeToEvent(event) > 86400) new1d.push(event);
                    else if (timeToEvent(event) <= 86400 && timeToEvent(event) > 21600) new6h.push(event);
                    else if (timeToEvent(event) <= 21600 && timeToEvent(event) > 10800) new3h.push(event);
                    else if (timeToEvent(event) <= 10800 && timeToEvent(event) > 7200) new2h.push(event);
                    else if (timeToEvent(event) <= 7200 && timeToEvent(event) > 3600) new1h.push(event);
                    else if (timeToEvent(event) <= 3600 && timeToEvent(event) > 1800) new30m.push(event);
                    else if (timeToEvent(event) <= 1800 && timeToEvent(event) > 600) new10m.push(event);
                });
    
                // Stores events
                await writeFile("1w", new1w);
                await writeFile("2d", new2d);
                await writeFile("1d", new1d);
                await writeFile("6h", new6h);
                await writeFile("3h", new3h);
                await writeFile("2h", new2h);
                await writeFile("1h", new1h);
                await writeFile("30m", new30m);
                await writeFile("10m", new10m);
            
                let fix = await readFile(arg);
                if (fix) res = true;
                else handleError("heal.mjs", `Healing of ${arg} failed because the file is still unreadable. Attempt: ${counter}. Trying again in 1 minute.`);
                break;
            };
        };
        if (counter == 5 || (counter >= 10 && counter % 10 == 0)) handleError("heal.mjs", `Healing ${arg} for ${counter} minutes unsuccessfully.`);
        counter++;
    } while (!res);

    sendNotification("heal.mjs", `Healing complete for ${arg} after ${counter} ${counter == 1 ? "minute":"minutes"}.`);

    console.log(`Healing complete for ${arg} at ${currentTime()} after running for ${counter} minutes`);
};