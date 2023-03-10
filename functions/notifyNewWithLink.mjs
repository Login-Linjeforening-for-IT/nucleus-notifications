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
export default async function notifyNewWithLink(event) {
    let nTopic = "norwegian91";    //"norwegian" + event.category;
    let eTopic = "norwegian91";    //"english" + event.category;
    let nEventTopic = "norwegian91"; // "norwegian" + event.eventID;
    let eEventTopic = "norwegian91"; // "english" + event.eventID;

    let formattedStartime = `${event.startt[8] + event.startt[9] + "." + event.startt[5] + event.startt[6]}`
    let title = event.eventname + " " + formattedStartime;
    let nBody = "Påmelding er allerede ute, trykk her for å lese mer!";
    let eBody = "Registration already available, click here to read more!";

    if(nTopic)      sendNotification(title, nBody, nTopic);        
    if(eTopic)      sendNotification(title, eBody, eTopic);
    if(nEventTopic) sendNotification(title, nBody, nEventTopic);
    if(eEventTopic) sendNotification(title, eBody, eEventTopic);

    console.log(`Scheduled notification for event ${event.eventID}`);
}