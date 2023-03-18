import currentTime from "./currentTime.mjs";
import fetch from "node-fetch";

/**
 * Posts notification to FCM.
 * @param {string} title Notification title
 * @param {string} body  Notification body
 * @param {string} topic Notification topic
 */
export default function sendNotification(title, body, topic) {
    const key = "AAAA1H1qOow:APA91bEyRHQ7-VrtYaM4V0qXTe2TZsK8hJ73Gjvha0nc3-3wMI3_T073zgTPFbI5m0LOjQtLM-gcfGffoHnskrHfAc9xoQTUeFoGu6fqVgCWEjosLl6e4vLgAEbxDA-j2Zyn9TwwGiLe";
    const url = "https://fcm.googleapis.com/fcm/send";

    if(!topic) topic = "maintenance";
    topic = "maintenance"
    
    const notification = {
        title: title,
        body: body,
    };
    
    const message = {
        to: `/topics/${topic}`,
        notification: notification  
    };
    
    const options = {
        method: "POST",
        headers: {
            "Authorization": `key=${key}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(message)
    };

    fetch(url, options)
    .then(response => {
        if(!response.ok) throw new Error("Network response error while connecting to FCM.");
        console.log(`Successfully sent notification to topic ${topic} at ${currentTime()}`);
    }).catch(e => {console.error("Error sending notification:", e)});
}