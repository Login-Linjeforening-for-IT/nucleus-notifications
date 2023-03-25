import notifyLinkFound from "./notifyLinkFound.mjs";
import joinlink from "./joinlink.mjs";

/**
 * Function for checking notifiedEvents for joinlink and if so move them to slowMonitored.txt
 * 
 * @param {array} events Events to check
 * @param {boolean} notify Option to notify the user that the joinlink is found
 * @returns Events that need to go to slowMonitored.txt
 */
export default function sortNotified(events, notify) {
    let slow = [];
    if(events.length > 0) {
        events.forEach(event => {
            if(joinlink(event)) {
                if (notify) notifyLinkFound(event); 
                slow.push(event);
            } else console.log(`Event ${event.eventID} does not satisfy. The joinlink is ${joinlink(event)}`)
        });
        return slow;
    } else {
        console.log("No new links found.");
        return -1;
    }
}