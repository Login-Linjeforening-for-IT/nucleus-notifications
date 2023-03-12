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
export default async function notifyNewEntry(event, category) {
    let nTopic = "norwegian91";    //"norwegian" + event.eventID;
    let eTopic = "norwegian91";    //"english" + event.eventID;

    let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
    let title = event.eventname + " " + formattedStartime;

    let nBody = "Trykk her for å lese mer. " + fetchEmoji(event);
    let eBody = "Click here to read more. " + fetchEmoji(event);
    
    if (category) {
        let cat = category.toUpperCase();
        nTopic = "norwegian" + cat;
        eTopic = "english" + cat;
    }

    if(nTopic)      sendNotification(title, nBody, nTopic);
    if(eTopic)      sendNotification(title, eBody, eTopic);
}