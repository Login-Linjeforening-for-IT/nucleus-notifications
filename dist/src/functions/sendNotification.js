import { api_key, api_url } from "../../.secrets.js";
import { isStable } from './fetch.js';
import fetch from "node-fetch";
/**
 * Posts notification to FCM.
 * @param {string} title    Notification title
 * @param {string} body     Notification body
 * @param {string} screen   Event to navigate to in the app, give the full object.
 * @param {string} topic    Notification topic
 */
export default function sendNotification({ title, body, screen, topic }) {
    // Sets the topic to maintenance if the topic is not available
    if (!topic || !isStable())
        topic = "maintenance";
    topic = "maintenance";
    // Defines the message to be sent
    const message = {
        to: `/topics/${topic}`,
        notification: {
            title: title,
            body: body,
        },
        data: screen
    };
    // Defines the fetch request to be sent with all info attached
    const options = {
        method: "POST",
        headers: {
            "Authorization": `key=${api_key}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    };
    // Sends the notification and waits for response
    fetch(api_url, options)
        .then(response => {
        if (!response.ok)
            console.log("Network response failed for ", title);
        console.log(`Successfully sent notification to topic ${topic} at ${new Date().toISOString()}`);
    }).catch(error => { console.error("Error sending notification:", error); });
}
// Examples of direct notifications that can be sent by node sendNotifications.ts
sendNotification({ title: "Tittel", body: "Beskrivelse", screen: undefined, topic: "norwegianTOPIC" });
// sendNotification("Title", "English description", undefined, "englishTOPIC")
// sendNotification("Test", "Kontakt tekkom om du mottok denne.")
