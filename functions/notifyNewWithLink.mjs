import fetchEmoji from "./fetchEmoji.mjs";
import sendNotification from "./sendNotification.mjs";

/**
 * Schedules a notification to FCM if a new event with a join link already available has been found and updates slowMonitored.txt
 * 
 * @see fetchSlowEvents()       Reads events from slowMonitored.txt
 * @see storeSlowMonitored()    Writes events to slowMonitored.txt
 * @see sendNotification()      Schedules a notification to FCM
 * 
 * @param {object} event        Event found
 */
export default async function notifyNewWithLink(event, category) {

    let nTopic = "norwegian91";    //"norwegian" + event.eventID;
    let eTopic = "norwegian91";    //"english" + event.eventID;

    let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
    let title = event.eventname + " " + formattedStartime;

    let nBody = "Påmelding er allerede ute, trykk her for å lese mer! " + fetchEmoji(event);
    let eBody = "Registration already available, click here to read more! " + fetchEmoji(event);

    if(category) {
        let cat = category.toUpperCase();
        nTopic = "norwegian" + cat;
        eTopic = "english" + cat;
    } else {
        if(nTopic)      sendNotification(title, nBody, nTopic);        
        if(eTopic)      sendNotification(title, eBody, eTopic);
    }

    console.log(`Scheduled notification for event ${event.eventID}`);
}