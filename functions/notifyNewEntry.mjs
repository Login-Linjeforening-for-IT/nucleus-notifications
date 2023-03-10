import sendNotification from "./sendNotification.mjs";
import joinlink from "./joinlink.mjs";

/**
 * Schedules a notification to FCM if a new event has been found
 * 
 * @param {object} event 
 * 
 * @see sendNotification(...) Posts the notification to FCM
 */
export default async function notifyNewEntry(event) {
    let nTopic = "norwegian91";    //"norwegian" + event.category;
    let eTopic = "norwegian91";    //"english" + event.category;
    let nEventTopic = "norwegian91"; // "norwegian" + event.eventID;
    let eEventTopic = "norwegian91"; // "english" + event.eventID;

    let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
    let title = event.eventname + " " + formattedStartime;
    let nBody = "Trykk her for å lese mer";
    let eBody = "Click here to read more."

    if(joinlink(event)) {
        if(nTopic)      sendNotification(title, nBody, nTopic);
        if(eTopic)      sendNotification(title, eBody, eTopic);
        if(nEventTopic) sendNotification(title, nBody, nEventTopic);
        if(eEventTopic) sendNotification(title, eBody, eEventTopic);
    }else{
        if(nTopic)      sendNotification(title, nBody, nTopic);
        if(eTopic)      sendNotification(title, eBody, eTopic);
        if(nEventTopic) sendNotification(title, nBody, nEventTopic);
        if(eEventTopic) sendNotification(title, eBody, eEventTopic);
    }
}