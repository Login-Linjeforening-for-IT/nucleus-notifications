import sendNotification from "./sendNotification.mjs";
import joinlink from "./joinlink.mjs";
import fetchEmoji from "./fetchEmoji.mjs";

/**
 * Schedules a notification to FCM if a new event has been found
 * 
 * @param {object} event 
 * 
 * @see sendNotification(...) Posts the notification to FCM
 */
export default async function notifyNewEntry(event) {
    let cat = event.category.toUpperCase();

    let nTopic = "norwegian" + cat;
    let eTopic = "english" + cat;

    let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
    let title = event.eventname + " " + formattedStartime;

    let nBody = "Trykk her for å lese mer. " + fetchEmoji(event);
    let eBody = "Click here to read more. " + fetchEmoji(event);

    if(nTopic)      sendNotification(title, nBody, nTopic);
    if(eTopic)      sendNotification(title, eBody, eTopic);

    console.log(`Scheduled notifyNewEntry notification for event ${event.eventID}`);
}