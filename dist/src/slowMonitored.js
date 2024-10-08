var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { storeSlowMonitored } from "./functions/store.js";
import sendNotification from "./functions/sendNotification.js";
import { detailedEvents } from "./functions/fetch.js";
import { readFile } from "./functions/file.js";
import handleAds from "./functions/ads.js";
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
 * @see storeSlowMonitored(...)     Stores events in file after all checks are completed
 * @see detailedEvents(...)         Returns all information about all events
 * @see joinlink(...)               Fetches the joinlink of an event
 * @see sendNotification(...)       Sends notification on change
 * @see readFile(...)               Reads content from given file
 */
export default function slowMonitored() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Slow monitoring every 30 minutes");
        // Fetches events from file and API
        const APIevents = yield detailedEvents(true);
        const slowEvents = yield readFile("slow");
        // Handles all ad functionality
        yield handleAds();
        // Checks all events with earlier version for potential changes
        for (const APIevent of APIevents) {
            const slow = slowEvents.find((event) => event.id === APIevent.id);
            // Defines norwegian topic
            const norwegianTopic = `n${APIevent.id}`;
            // Defines english topic
            const englishTopic = `e${APIevent.id}`;
            // Boolean for if the event has a time
            const time = slow && slow.time_start !== APIevent.time_start ? true : false;
            // Boolean for if the event has a link
            const link = slow && slow.link_signup.includes("http") !== APIevent.link_signup.includes("http") && APIevent.link_signup.includes("http") ? true : false;
            // Formats date of the event
            const formattedStarttime = `${APIevent.time_start[8]}${APIevent.time_start[9]}.${APIevent.time_start[5]}${APIevent.time_start[6]}`;
            // Event name
            const name_no = `${APIevent.name_no || APIevent.name_en} ${formattedStarttime}`;
            const name_en = `${APIevent.name_en || APIevent.name_no} ${formattedStarttime}`;
            // Location of the event
            const newLocation = slow && slow.location !== APIevent.location ? true : false;
            // Formats hour of the event
            const hour = `${APIevent.time_start[11]}${APIevent.time_start[12]}:${APIevent.time_start[14]}${APIevent.time_start[15]}`;
            // Body of the notification
            let norwegianBody = "";
            let englishBody = "";
            // Sends the relevant notification to the relevant topics with the relevant information
            if (time && link && newLocation) {
                norwegianBody = `Arrangementet har blitt endret. Ny tid: ${hour} den ${formattedStarttime}. Nytt sted: ${APIevent.location}. Trykk her for alle detaljene.`;
                englishBody = `Event has changed. New time: ${hour} on ${formattedStarttime}. New location: ${APIevent.location}. Tap here for details.`;
            }
            else if (time && link) {
                norwegianBody = `Tid endret til kl: ${hour} den ${formattedStarttime}. Påmeldingslinken er også endret. Trykk her for flere detaljer.`;
                englishBody = `Time changed to: ${hour} on ${formattedStarttime}. Registration link has also changed. Tap here for details.`;
            }
            else if (time && newLocation) {
                norwegianBody = `Tid og sted endret. Ny tid: ${hour} den ${formattedStarttime}. Nytt sted: ${APIevent.location}. Trykk her for å se den oppdaterte informasjonen.`;
                englishBody = `Time and location changed. New time: ${hour} on ${formattedStarttime}. New location: ${APIevent.location}. Tap here for details.`;
            }
            else if (link && newLocation) {
                norwegianBody = `Nytt sted: ${APIevent.location}. Påmeldingslink har også blitt endret. Trykk her for mer informasjon.`;
                englishBody = `New location: ${APIevent.location}. Registration link has also changed. Click here for more information.`;
            }
            else if (time) {
                norwegianBody = `Tidspunkt endret til kl ${hour} den ${formattedStarttime}.`;
                englishBody = `Time changed to ${hour} on ${formattedStarttime}.`;
            }
            else if (newLocation) {
                norwegianBody = `Sted endret til ${APIevent.location}.`;
                englishBody = `Location changed to ${APIevent.location}.`;
            }
            else if (link) {
                norwegianBody = "Ny påmeldingslink lagt ut!";
                englishBody = "New registration link available!";
            }
            if (norwegianBody) {
                sendNotification({
                    title: name_no,
                    body: norwegianBody,
                    screen: APIevent,
                    topic: norwegianTopic
                });
            }
            if (englishBody) {
                sendNotification({
                    title: name_en,
                    body: englishBody,
                    screen: APIevent,
                    topic: englishTopic
                });
            }
        }
        // Defines the new array of events to be slowmonitored
        const newSlow = APIevents.filter((api) => (slowEvents.some((slow) => slow.id === api.id)));
        // Logs the length of the new array
        console.log("newslow", newSlow.length);
        // Overwrites slowMonitored.json after checking for changes.
        if (newSlow.length > 0)
            storeSlowMonitored({ events: newSlow, overwrite: true });
        // Otherwise logs that there are no events in api.
        else
            console.log("Found nothing new.");
    });
}
