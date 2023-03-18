import notifyNewWithLink from "./notifyNewWithLink.mjs";
import notifyNewEntry from "./notifyNewEntry.mjs";
import timeToEvent from "./timeToEvent.mjs";
import joinlink from "./joinlink.mjs";

/**
 * Function for sorting events from API into their seperate categories
 * 
 * @param {array} events Events to sort
 * @param {boolean} notify Option to notify end user
 * @returns Events and slowevents as objects
 */
export default function sortEvents(events, notify) {
    let slow = [], notified = [];
    if(events.length > 0) {
        events.forEach(event => {
            if (joinlink(event)) {
                if (notify) notifyNewWithLink(event); 
                slow.push(event);
            } else {
                if(timeToEvent(event) <= 1209600) {
                    if (notify) notifyNewEntry(event); 
                    notified.push(event);
                } else console.log(event.eventID, "will not be added till another", timeToEvent(event)-1209600, "seconds have passed.")
            }
        });

        let obj = {
            slow: slow,
            notified: notified
        };

        return obj;
    } else console.log("Nothing to sort.");
}