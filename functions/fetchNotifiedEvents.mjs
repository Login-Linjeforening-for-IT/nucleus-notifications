import * as fs from 'fs';

/**
 * Fetches notifiedEvents.txt (Already notified, but waiting for joinlink)
 */
export default function fetchNotifiedEvents() {
    return new Promise((res, rej) => {
        fs.readFile('./data/notifiedEvents.txt', (err, data) => {
            if (err) rej (err);
            let events = JSON.parse(data.toString());
            res (events);
        })
    })
}