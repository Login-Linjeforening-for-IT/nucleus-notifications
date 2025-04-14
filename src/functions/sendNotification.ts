import admin from 'firebase-admin'
import { Message, getMessaging } from "firebase-admin/messaging"
import handleNestedObjects from "./stringifyNestedObjects.js"
import SERVICE_ACCOUNT from '../config.js'

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT)
})

type sendNotificationProps = {
    title: string
    body: string
    screen?: DetailedEvent | DetailedAd
    topic?: string
}


/**
 * Posts notification to FCM.
 * @param title    Notification title
 * @param body     Notification body
 * @param screen   Event to navigate to in the app, give the full object.
 * @param topic    Notification topic
 */
export default async function sendNotification({title, body, screen, topic}: sendNotificationProps): Promise<void> {
    try {
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

        const response = await getMessaging().send(message)

        if (typeof response != 'string') {
            throw new Error("Error sending notification: Unexpected response from FCM.")
        }

        // Logs the response with the ID of the notification that was sent
        console.log(`Sent notification "${title}" with body "${body}" to topic "${topic}" at ${new Date().toISOString()}: ${response}`)
    } catch (error) {
        console.error(`Error sending notification "${title}" with body "${body}"${screen ? ` to screen "${screen}"` : ''} to topic "${topic}". The following error occured: `, error)
    }
}

// Examples of direct notifications that can be sent by node sendNotifications.ts
// Topics: nTOPIC, eTOPIC, ...

// sendNotification({title: "Tittel", body: "Beskrivelse", topic: "maintenance"})
// sendNotification("Title", "English description", "", "maintenace")
// sendNotification("Test", "Kontakt tekkom om du mottok denne.")
