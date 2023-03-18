import handleError from './handleError.mjs';
import file from './file.mjs';
import * as fs from 'fs';

/**
 * Writes events to notifiedEvents.txt (they are coming up but they dont have a join link yet)
 * 
 * @see fetchNotifiedEvents()   Reads notifiedEvents.txt
 * 
 * @param {string} filename Filename to write to
 * @param {array} content Content to write to file 
 */
export default async function writeFile(filename, content) {
    let f = file(filename);

    let sc = JSON.stringify(content)
    fs.writeFile(f, content ? sc:"[]", (err) => {
        if (err) return handleError("writeFile.mjs", err);
        console.log(`Overwrote ${filename}. Total: ${content ? content.length:0} events.`);
    });
};