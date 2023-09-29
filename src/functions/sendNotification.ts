import { api_key, api_url } from "../../.secrets.js"
import fetch from "node-fetch"
import { stable } from "../data/info.js"

type sendNotificationProps = {
    title: string
    body: string
    screen?: string | object
    topic?: string
}

/**
 * Posts notification to FCM.
 * @param title    Notification title
 * @param body     Notification body
 * @param screen   Event to navigate to in the app, give the full object.
 * @param topic    Notification topic
 */
export default function sendNotification({title, body, screen, topic}: sendNotificationProps): void {
    // Sets the topic to maintenance if the topic is not available
    if (!topic || !stable) topic = "maintenance"
    topic = "maintenance"
    // Defines the message to be sent
    const message = {
        to: `/topics/${topic}`,
        notification: {
            title: title,
            body: body,
        },
        data: screen
    }
    
    // Defines the fetch request to be sent with all info attached
    const options = {
        method: "POST",
        headers: {
            "Authorization": `key=${api_key}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    }

    // Sends the notification and waits for response
    fetch(api_url, options)
    .then(response => {
        if (!response.ok) {
            console.log("Network response failed for ", title, "Response: ", response)
        } else {
            console.log(`Successfully sent notification to topic ${topic} at ${new Date().toISOString()}`)
        }
    }).catch(error => {console.error("Error sending notification:", error)})
}

// Examples of direct notifications that can be sent by node sendNotifications.ts

sendNotification({title: "Tittel", body: "Beskrivelse", topic: "norwegianTOPIC"})
// sendNotification("Title", "English description", "", "englishTOPIC")
// sendNotification("Test", "Kontakt tekkom om du mottok denne.")
