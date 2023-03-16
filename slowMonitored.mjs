import storeSlowMonitored from "./functions/storeSlowMonitored.mjs";
import sendNotification from "./functions/sendNotification.mjs";
import fetchSlowEvents from "./functions/fetchSlowEvents.mjs";
import detailedEvents from "./functions/detailedEvents.mjs";
import joinlink from "./functions/joinlink.mjs";

/**
 * **Slow monitored event notifications**
 * 
 * Monitors events where changes are unlikely at a larger interval to save 
 * computational resources
 * 
 * - Fetches API
 * - Monitors events every 30 minutes
 * - Schedules notifications on changes
 * 
 * @see storeSlowMonitored()    Stores events in file after all checks are completed
 * @see detailedEvents()        Returns all information about all events
 * @see fetchSlowEvents()       Reads events from slowMonitored.txt
 * @see joinlink()              Fetches the joinlink of an event
 * @see sendNotification()      Sends notification on change
 */
export default async function slowMonitored() {
    console.log("Slow monitoring every 30 minutes");

    // Fetches events from file and API
    let APIevents = await detailedEvents(1); 
    let slowEvents = await fetchSlowEvents();

    // Checks all events with earlier version for potential changes
    for (const APIevent of APIevents) {
        const slow = slowEvents.find(event => event.eventID === APIevent.eventID);

        let nTopic = "norwegian" + APIevent.eventID;
        let eTopic = "english" + APIevent.eventID;

        let time = false;
        let link = false;
        let location = false;

        if(slow && slow.startt !== APIevent.startt)             time = true;
        if(slow && joinlink(slow) !== joinlink(APIevent))       link = true;
        if(slow && slow.roomno !== APIevent.roomno)         location = true;
        if(slow && slow.campus !== APIevent.campus)         location = true;
        if(slow && slow.street !== APIevent.street)         location = true;

        if(!joinlink(APIevent)) link = false;

        let formattedStartime = `${APIevent.startt[8] + APIevent.startt[9] + "." + APIevent.startt[5] + APIevent.startt[6]}`
        let title = APIevent.eventname + " " + formattedStartime;
    
        let room = APIevent.roomno ? APIevent.roomno + ', ':'';
        let campus = APIevent.campus ? APIevent.campus + ', ':'';
        let street = APIevent.street ? APIevent.street:'';
        let loc = room + campus + street;
        
        let hour = APIevent.startt[11] + APIevent.startt[12] + ':' + APIevent.startt[14] + APIevent.startt[15];

        if(time && link && location) {
            let nBody = `Arrangementet har blitt endret. Ny tid: ${hour} den ${formattedStartime}. Nytt sted: ${loc}. Trykk her for alle detaljene.`;
            let eBody = `Event has changed. New time: ${hour} on ${formattedStartime}. New location: ${loc}. Tap here for details.`;

            if(nTopic)      sendNotification(title, nBody, nTopic);
            if(eTopic)      sendNotification(title, eBody, eTopic);

        }else if(time && link){
            let nBody = `Tid endret til kl: ${hour} den ${formattedStartime}. Påmeldingslinken er også endret. Trykk her for flere detaljer.`;
            let eBody = `Time changed to: ${hour} on ${formattedStartime}. Registration link has also changed. Tap here for details.`;

            if(nTopic)      sendNotification(title, nBody, nTopic);
            if(eTopic)      sendNotification(title, eBody, eTopic);
           
        }else if(time && location) {
            let nBody = `Tid og sted endret. Ny tid: ${hour} den ${formattedStartime}. Nytt sted: ${loc}. Trykk her for å se den oppdaterte informasjonen.`;
            let eBody = `Time and location changed. New time: ${hour} on ${formattedStartime}. New location: ${loc}. Tap here for details.`;

            if(nTopic)      sendNotification(title, nBody, nTopic);
            if(eTopic)      sendNotification(title, eBody, eTopic);
          
        }else if(link && location) {
            let nBody = `Nytt sted: ${loc}. Påmeldingslink har også blitt endret. Trykk her for mer informasjon.`;
            let eBody = `New location: ${loc}. Registration link has also changed. Click here for more information.`;

            if(nTopic)      sendNotification(title, nBody, nTopic);
            if(eTopic)      sendNotification(title, eBody, eTopic);
        
        }else if(time) {
            let nBody = `Tidspunkt endret til kl ${hour} den ${formattedStartime}.`;
            let eBody = `Time changed to ${hour} on ${formattedStartime}.`;

            if(nTopic)      sendNotification(title, nBody, nTopic);
            if(eTopic)      sendNotification(title, eBody, eTopic);
           
        }else if(location) {
            let nBody = `Sted endret til ${loc}`;
            let eBody = `Location changed to ${loc}`;

            if(nTopic)      sendNotification(title, nBody, nTopic);
            if(eTopic)      sendNotification(title, eBody, eTopic);

        }else if(link) {
            let nBody = `Ny påmeldingslink lagt ut!`;
            let eBody = `New registration link available!`;

            if(nTopic)      sendNotification(title, nBody, nTopic);
            if(eTopic)      sendNotification(title, eBody, eTopic);

        }
    }

    let newSlow = APIevents.filter(api => (slowEvents.some(slow => slow.eventID === api.eventID)))
    console.log("newslow", newSlow.length)
    
    if(newSlow.length > 0) storeSlowMonitored(newSlow,1);       // Overwrites slowMonitored.txt after checking for changes.
    else console.log("Found nothing new.");                     // Otherwise logs that there are no events in api.

};