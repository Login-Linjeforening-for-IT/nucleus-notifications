import handleError from './handleError.mjs';
import heal from './heal.mjs';
import file from './file.mjs';
import * as fs from 'fs';

/**
 * Fetches notifiedEvents.txt (Already notified, but waiting for joinlink)
 */
export default function fetchNotifiedEvents() {
    let f = file("notified");

    return new Promise((res) => {
        fs.readFile(f, async (err, data) => {
            if (err) res(handleError(f, err))
            try {
                let events = JSON.parse(data.toString());
                if(events)  res (events);
                else res(handleError(f, err));
            } catch (e) {
                await heal("notified");
                fs.readFile(f, async (err, data) => {
                    if (err) res(handleError(f, err));
                    try {
                        let events = JSON.parse(data.toString());
                        if(events)  res (events);
                        else res(handleError(f, err));
                    } catch (e) {res(handleError(f, err))};
                });
            };
        });
    });
};