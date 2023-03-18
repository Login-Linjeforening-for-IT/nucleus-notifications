import handleError from './handleError.mjs';
import heal from './heal.mjs';
import file from './file.mjs';
import * as fs from 'fs';

/**
 * Fetches slowevents.txt (slow monitored events updated every 30 mins)
 */
export default async function fetchSlowEvents() {
    let f = file("slow");

    return new Promise((res) => {
        fs.readFile(f, async (e, data) => {
            if (e) res(handleError(f, e))
            try {
                let slowEvents = JSON.parse(data.toString());
                res(slowEvents);
            } catch (e) {
                await heal("slow");
                fs.readFile(f, async (e, data) => {
                    if (e) res(handleError(f, e))
                    try {
                        let slowEvents = JSON.parse(data.toString());
                        res(slowEvents);
                    } catch (e) {res(handleError(f, e))}
                });
            };
        });
    });
};