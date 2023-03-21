import sendNotification from "./sendNotification.mjs";
import fetchEmoji from "./fetchEmoji.mjs";

/**
 * Schedules a notification to FCM if a join link has been found and updates slowMonitored.txt
 * 
 * @see fetchSlowEvents()       Reads events from slowMonitored.txt
 * @see sendNotification()      Posts the notification to FCM servers
 * 
 * @param {object} event        Event to schedule notification for
 */
export default async function notifyLinkFound(event) {
    let cat = event.category.toUpperCase();

    let nTopic = "norwegian" + cat;
    let eTopic = "english" + cat;

    let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
    let title = event.eventname + " " + formattedStartime;
    let nBody = "Påmelding er ute! " + fetchEmoji(event);
    let eBody = "Registration available! " + fetchEmoji(event);

    if(nTopic)      sendNotification(title, nBody, event, nTopic);
    if(eTopic)      sendNotification(title, eBody, event, eTopic);

    console.log(`Scheduled notifyLinkFound notification for event ${event.eventID}`);
}