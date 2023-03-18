import handleError from './handleError.mjs';
import file from './file.mjs';
import heal from './heal.mjs';
import * as fs from 'fs';

/**
 * Fetches interval files 

 * @param {string} time Time interval for the specified file
 * @returns Events from specified file
 */
export default async function readFile(arg) {
    let f = file(arg);
    
    return new Promise((res) => {
        fs.readFile(f, async (err, data) => {
            if (err) res(handleError("readFile.mjs", err));
            try {
                let events = JSON.parse(data.toString());
                res (events);
            } catch (e) {
                await heal(arg);
                fs.readFile(f, async (err, data) => {
                    if (err) res(handleError("readFile.mjs", err));
                    try {
                        let events = JSON.parse(data.toString());
                        res (events);
                    } catch (e) {return handleError("readFile.mjs", e)}
                });
            };
        });
    });
};