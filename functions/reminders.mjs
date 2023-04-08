import sendNotification from "./sendNotification.mjs";
import detailedEvents from "./detailedEvents.mjs";
import currentTime from "./currentTime.mjs";
import timeToEvent from "./timeToEvent.mjs";
import fetchEmoji from "./fetchEmoji.mjs";
import readFile from "./readFile.mjs";
import writeFile from "./writeFile.mjs";
import handleError from "./handleError.mjs";

/**
 * Schedules a notification to FCM if a new event with a join link already available has been found and updates slowMonitored.txt
 * 
 * @see fetchSlowEvents()       Reads events from slowMonitored.txt
 * @see storeSlowMonitored()    Writes events to slowMonitored.txt
 * @see sendNotification()      Schedules a notification to FCM
 * 
 * @param {object} event        Event found
 */
export default async function reminders() {
    let reminders = 0;

    // Fetches details for all events unfiltered.
    let events = await detailedEvents(1);
    if(!events) return handleError("reminders.mjs", "events is undefined");

    // Fetches events in each interval
    let stored10m = await readFile("10m");
    let stored30m = await readFile("30m");
    let stored1h  = await readFile("1h");
    let stored2h  = await readFile("2h");
    let stored3h  = await readFile("3h");
    let stored6h  = await readFile("6h");
    let stored1d  = await readFile("1d");
    let stored2d  = await readFile("2d");
    let stored1w  = await readFile("1w");

    // Filters out events that are ready to be notified about
    let notify10m = stored10m.filter(event => timeToEvent(event) <= 600)
    let notify30m = stored30m.filter(event => timeToEvent(event) <= 1800);
    let notify1h = stored1h.filter(event => timeToEvent(event) <= 3600);
    let notify2h = stored2h.filter(event => timeToEvent(event) <= 7200);
    let notify3h = stored3h.filter(event => timeToEvent(event) <= 10800);
    let notify6h = stored6h.filter(event => timeToEvent(event) <= 21600);
    let notify1d = stored1d.filter(event => timeToEvent(event) <= 86400);
    let notify2d = stored2d.filter(event => timeToEvent(event) <= 172800);
    let notify1w = stored1w.filter(event => timeToEvent(event) <= 604800);

    // Schedules notifications for events 10 minutes away
    notify10m.forEach(event => {
        let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
        let title = event.eventname + " " + formattedStartime;

        let nTopic = "norwegian" + event.eventID + (event.category).toLowerCase() + "10m";
        let eTopic = "english"+ event.eventID + (event.category).toLowerCase() + "10m";

        let nBody = "Begynner om 10 minutter! " + fetchEmoji(event);
        let eBody = "Starts in 10 minutes! " + fetchEmoji(event);
        
        if(nTopic) sendNotification(title, nBody, event, nTopic);
        if(eTopic) sendNotification(title, eBody, event, eTopic);
        reminders+=2;
    });

    // Schedules notifications for events 30 minutes away
    notify30m.forEach(event => {
        let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
        let title = event.eventname + " " + formattedStartime;

        let nTopic = "norwegian" + event.eventID + (event.category).toLowerCase() + "30m";
        let eTopic = "english"+ event.eventID + (event.category).toLowerCase() + "30m";

        let nBody = "Begynner om 30 minutter! " + fetchEmoji(event);
        let eBody = "Starts in 30 minutes! " + fetchEmoji(event);

        if(nTopic) sendNotification(title, nBody, event, nTopic);
        if(eTopic) sendNotification(title, eBody, event, eTopic);
        reminders+=2;
    });

    // Schedules notifications for events 1 hour away
    notify1h.forEach(event => {
        let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
        let title = event.eventname + " " + formattedStartime;

        let nTopic = "norwegian" + event.eventID + (event.category).toLowerCase() + "1h";
        let eTopic = "english"+ event.eventID + (event.category).toLowerCase() + "1h";

        let nBody = "Begynner om 1 time! " + fetchEmoji(event);
        let eBody = "Starts in 1 hour! " + fetchEmoji(event);
        
        if(nTopic) sendNotification(title, nBody, event, nTopic);
        if(eTopic) sendNotification(title, eBody, event, eTopic);
        reminders+=2;
    });

    // Schedules notifications for events 2 hours away
    notify2h.forEach(event => {
        let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
        let title = event.eventname + " " + formattedStartime;
        
        let nTopic = "norwegian" + event.eventID + (event.category).toLowerCase() + "2h";
        let eTopic = "english"+ event.eventID + (event.category).toLowerCase() + "2h";

        let nBody = "Begynner om 2 timer! " + fetchEmoji(event);
        let eBody = "Starts in 2 hours! " + fetchEmoji(event);

        if(nTopic) sendNotification(title, nBody, event, nTopic);
        if(eTopic) sendNotification(title, eBody, event, eTopic);
        reminders+=2;
    });

    // Schedules notifications for events 3 hours away
    notify3h.forEach(event => {
        let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
        let title = event.eventname + " " + formattedStartime;

        let nTopic = "norwegian" + event.eventID + (event.category).toLowerCase() + "3h";
        let eTopic = "english"+ event.eventID + (event.category).toLowerCase() + "3h";

        let nBody = "Begynner om 3 timer! " + fetchEmoji(event);
        let eBody = "Starts in 3 hours! " + fetchEmoji(event);
        
        if(nTopic) sendNotification(title, nBody, event, nTopic);
        if(eTopic) sendNotification(title, eBody, event, eTopic);
        reminders+=2;
    });

    // Schedules notifications for events 6 hours away
    notify6h.forEach(event => {
        let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
        let title = event.eventname + " " + formattedStartime;

        let nTopic = "norwegian" + event.eventID + (event.category).toLowerCase() + "6h";
        let eTopic = "english"+ event.eventID + (event.category).toLowerCase() + "6h";

        let nBody = "Begynner om 6 timer! " + fetchEmoji(event);
        let eBody = "Starts in 6 hours! " + fetchEmoji(event);
        
        if(nTopic) sendNotification(title, nBody, event, nTopic);
        if(eTopic) sendNotification(title, eBody, event, eTopic);
        reminders+=2;
    });

    // Schedules notifications for events 1 day away.
    notify1d.forEach(event => {
        let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`;
        let time = `${event.startt[11] + event.startt[12] + ":" + event.startt[14] + event.startt[15]}`
        let hour = Number(event.startt[11]+event.startt[12])
        let ampm = (hour > 0 && hour <= 12) ? "am":"pm";

        let title = event.eventname + " " + formattedStartime;

        let nTopic = "norwegian" + event.eventID + (event.category).toLowerCase() + "1d";
        let eTopic = "english"+ event.eventID + (event.category).toLowerCase() + "1d";

        let nBody = `I morgen klokken ${time}! ` + fetchEmoji(event);
        let eBody = `Tomorrow at ${hour + ampm}! ` + fetchEmoji(event);
        
        if(nTopic) sendNotification(title, nBody, event, nTopic);
        if(eTopic) sendNotification(title, eBody, event, eTopic);
        reminders+=2;
    });

    // Schedules notifications for events 2 days away.
    notify2d.forEach(event => {
        let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`;
        let time = `${event.startt[11] + event.startt[12] + ":" + event.startt[14] + event.startt[15]}`
        let hour = Number(event.startt[11]+event.startt[12])
        let ampm = (hour > 0 && hour <= 12) ? "am":"pm";

        let title = event.eventname + " " + formattedStartime;

        let nTopic = "norwegian" + event.eventID + (event.category).toLowerCase() + "2d";
        let eTopic = "english"+ event.eventID + (event.category).toLowerCase() + "2d";

        let nBody = `Overimorgen ${time}! ` + fetchEmoji(event);
        let eBody = `In 2 days at ${hour + ampm}! ` + fetchEmoji(event);
        
        if(nTopic) sendNotification(title, nBody, event, nTopic);
        if(eTopic) sendNotification(title, eBody, event, eTopic);
        reminders+=2;
    });

    // Schedules notifications for events 1 week away.
    notify1w.forEach(event => {
        let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`;

        let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let ukedager = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];

        let year = event.startt[0] + event.startt[1] + event.startt[2] + event.startt[3];
        let month = event.startt[5] + event.startt[6];
        let day = event.startt[8] + event.startt[9];
        let time = `${event.startt[11] + event.startt[12] + ":" + event.startt[14] + event.startt[15]}`
        let hour = Number(event.startt[11]+event.startt[12])
        let ampm = (hour > 0 && hour <= 12) ? "am":"pm";
        
        let date = new Date(`${year}-${month}-${day}`);
        let ukedag = ukedager[date.getDay()];
        let weekday = weekdays[date.getDay()];
        
        let title = event.eventname + " " + formattedStartime;
        
        let nTopic = "norwegian" + event.eventID + (event.category).toLowerCase() + "1w";
        let eTopic = "english"+ event.eventID + (event.category).toLowerCase() + "1w";
        
        let nBody = `Neste ${ukedag} kl. ${time}! ` + fetchEmoji(event);
        let eBody = `Next ${weekday} at ${hour + ampm}! ` + fetchEmoji(event);

        if(nTopic) sendNotification(title, nBody, event, nTopic);
        if(eTopic) sendNotification(title, eBody, event, eTopic);
        reminders+=2;
    });

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

    if(reminders)   console.log(`Scheduled ${reminders} reminders at`, currentTime());
    else            console.log("No reminders to be sent at this time", currentTime());
}