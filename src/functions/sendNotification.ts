import { initializeApp, applicationDefault } from "firebase-admin/app"
import { Message, getMessaging } from "firebase-admin/messaging"
import handleNestedObjects from "./stringifyNestedObjects.js"
import { stable } from "../data/info.js"

type sendNotificationProps = {
    title: string
    body: string
    screen?: DetailedEvent | DetailedAd
    topic?: string
}

const app = initializeApp({
    credential: applicationDefault()
})

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
    
    // Change the id to string if screen is defined
    if(screen) {
        screen.id = screen.id.toString()
    }

    const data: any = handleNestedObjects(screen)

    // Defines the message to be sent
    const message: Message = {
        topic: topic,
        notification: {
            title: title,
            body: body,
        },
        data: data
    }

    // Sends the message
    getMessaging().send(message).then(response => {
        console.log(`Successfully sent notification to topic ${topic} at ${new Date().toISOString()}`)
    }).catch(error => {console.error("Error sending notification:", error)})
}

// Examples of direct notifications that can be sent by node sendNotifications.ts
// Topics: nTOPIC, eTOPIC, ...

// sendNotification({title: "Tittel", body: "Beskrivelse", topic: "maintenance"})
// sendNotification("Title", "English description", "", "maintenace")
// sendNotification("Test", "Kontakt tekkom om du mottok denne.")