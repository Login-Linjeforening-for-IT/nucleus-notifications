var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import schedule from "./notify.js";
import fetchEvents, { timeToEvent } from "./fetch.js";
import handleError from "./error.js";
import { readFile } from "./file.js";
/**
 * Function for sorting events from API into their seperate categories
 *
 * @param events Events to sort
 * @param notify Option to notify end user
 *
 * @see schedule(...)  Notifies the end user of a new event with a joinlink available
 * @see timeToEvent(...)        Returns the time to the event
 *
 * @returns Events and slowevents as objects
 */
export default function sortEvents({ events, slow, notify }) {
    // Defines empty arrays
    const newSlow = slow || [];
    const notified = [];
    // Returns if there are no events to sort
    if (!events || !events.length) {
        console.log("Nothing to sort.");
        return { slow: [], notified: [] };
    }
    // Goes through each event
    events.forEach(event => {
        if (!event.link_signup.includes("http")) {
            // Event is far away, console log when it will be added and return
            if (timeToEvent(event) > 1209600) {
                return console.log("Event", event.id, "will be added in", Number((timeToEvent(event) - 1209600).toFixed(0)), "seconds.");
            }
            // If the user should be notified, notifies the user
            if (!Includes({ events: newSlow, id: Number(event.id) }) && notify) {
                schedule({
                    event,
                    textNO: "Trykk her for å lese mer.",
                    textEN: "Click here to read more.",
                    actionName: "notifyNewEntry"
                });
            }
            // Pushes the event to the notified array
            notified.push(event);
        }
        if (!Includes({ events: newSlow, id: Number(event.id) }) && notify) {
            schedule({
                event,
                textNO: "Påmelding er allerede ute, trykk her for å lese mer!",
                textEN: "Registration already available, click here to read more!",
                actionName: "notifyNewWithLink"
            });
        }
        // Pushes the event to the slowmonitored array
        newSlow.push(event);
    });
    // Returns the sorted object
    return { slow: newSlow, notified };
}
/**
 * Function for checking notifiedEvents for joinlink and if so move them to slowMonitored.json
 *
 * @param events Events to check
 * @param notify Option to notify the user that the joinlink is found
 *
 * @see schedule(...) Sends the notification to FCM
 * @see joinlink(...) Fetches the joinlink for an event
 *
 * @returns Events that need to go to slowMonitored.json
 */
export function sortNotified({ events, notify }) {
    // Defines array for events to be slowmonitored
    const slow = [];
    // Returns a empty array if there are no events to sort
    if (!events || !events.length)
        return [];
    // Goes through each event
    events.forEach(event => {
        var _a;
        // If the user should be notified, notifies the user
        if (((_a = event.link_signup) === null || _a === void 0 ? void 0 : _a.includes('http')) && notify) {
            schedule({
                event,
                textNO: "Påmelding er ute!",
                textEN: "Registration available!",
                actionName: "notifyLinkFound"
            });
            // Pushes the event to the notified array
            slow.push(event);
        }
    });
    // Returns the array
    return slow;
}
/**
 * Function for comparing events with slowevents and removing events that are already slowmonitored
 *
 * @see fetchEvents()       Fetches event from API
 * @see handleError(...)    Handles any error that occurs
 * @see readFile(...)       Reads from given file
 *
 * @returns                 Filtered object
 */
export function filterEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetches events
            const events = yield fetchEvents();
            // Fetches slow monitored events (events where changes are unlikely)
            const slowEvents = yield readFile("slow");
            // Filters events to avoid multiples of the same event 
            const filteredEvents = slowEvents.length
                ? events.filter(event => !slowEvents.some(slowevents => slowevents.id === event.id))
                : events;
            // Handles error where the filtered events are undefined
            if (!filteredEvents) {
                handleError({
                    file: "filterEvents",
                    error: "filteredEvents is undefined"
                });
                return [];
            }
            // returns filtered events
            return filteredEvents;
            // Catches and handles any unknown errors
        }
        catch (error) {
            handleError({ file: "filterEvents", error: error });
            return [];
        }
    });
}
function Includes({ events, id }) {
    for (const event of events) {
        if (Number(event.id) === id) {
            return true;
        }
    }
    return false;
}
