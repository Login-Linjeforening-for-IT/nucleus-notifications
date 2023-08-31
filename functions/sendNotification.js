import secret from '../.secrets.json' assert {"type": "json"}
import { isStable } from './fetch.js';
import fetch from "node-fetch";

/**
 * Posts notification to FCM.
 * @param {string} title Notification title
 * @param {string} body  Notification body
 * @param {string} data  Notification data
 * @param {string} topic Notification topic
 */
export default function sendNotification(title, body, data, topic) {
    const key = secret["api-key"];
    const url = secret["api-url"];

    // Sets the topic to maintenance if the topic is not available
    if(!topic || !isStable()) topic = "maintenance";
    
    // Defines the message to be sent
    const message = {
        to: `/topics/${topic}`,
        notification: {
            title: title,
            body: body,
            data: data,
        }
    };
    
    // Defines the fetch request to be sent with all info attached
    const options = {
        method: "POST",
        headers: {
            "Authorization": `key=${key}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    };

    // Sends the notification and waits for response
    fetch(url, options)
    .then(response => {
        if(!response.ok) console.log("Network response failed for ", title);
        console.log(`Successfully sent notification to topic ${topic} at ${new Date().toISOString()}`);
    }).catch(error => {console.error("Error sending notification:", error)});
}

// Examples of direct notifications that can be sent by node sendNotifications.js

// sendNotification("Tittel", "Norwegian description", undefined, "norwegianTOPIC")
// sendNotification("Title", "English description", undefined, "englishTOPIC")
// sendNotification("Test", "Kontakt tekkom om du mottok denne.")