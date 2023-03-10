import * as fs from 'fs';

/**
 * Fetches slowevents.txt (slow monitored events updated every 30 mins)
 */
export default function fetchSlowEvents() {
    return new Promise((res, rej) => {
        fs.readFile('./data/slowMonitored.txt', (err, data) => {
            if (err) rej (err);
            let slowEvents = JSON.parse(data.toString());
            res(slowEvents);
        });
    })
}