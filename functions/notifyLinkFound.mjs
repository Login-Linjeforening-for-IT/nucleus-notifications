import sendNotification from "./sendNotification.mjs";
import fetchSlowEvents from "./fetchSlowEvents.mjs";

/**
 * Schedules a notification to FCM if a join link has been found and updates slowMonitored.txt
 * 
 * @see fetchSlowEvents()       Reads events from slowMonitored.txt
 * @see sendNotification()      Posts the notification to FCM servers
 * 
 * @param {object} event        Event to schedule notification for
 */
export default async function notifyLinkFound(event) {
    let nTopic = "norwegian91";    //"norwegian" + event.category;
    let eTopic = "norwegian91";    //"english" + event.category;
    let nEventTopic = "norwegian91"; // "norwegian" + event.eventID;
    let eEventTopic = "norwegian91"; // "english" + event.eventID;

    let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
    let title = event.eventname + " " + formattedStartime;
    let nBody = "Påmelding er ute!";
    let eBody = "Registration available!";

    let slowMonitored = await fetchSlowEvents();
    if(slowMonitored) {
        if(nTopic)      sendNotification(title, nBody, nTopic);
        if(eTopic)      sendNotification(title, eBody, eTopic);
        if(nEventTopic) sendNotification(title, nBody, nEventTopic);
        if(eEventTopic) sendNotification(title, eBody, eEventTopic);
    }
}