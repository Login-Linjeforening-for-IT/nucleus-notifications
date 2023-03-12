import * as fs from 'fs';

/**
 * Writes events to interval file. 
 * 
 * @param {object} events Events to store
 * @param {string} time Time interval of desired file
*/
export default async function storeInterval(events, time) {
    function file(time) {
        switch (time) {
            case "10m": return './data/intervals/10m.txt'
            case "30m": return './data/intervals/30m.txt'
            case "1h": return './data/intervals/1h.txt'
            case "2h": return './data/intervals/2h.txt'
            case "3h": return './data/intervals/3h.txt'
            case "6h": return './data/intervals/6h.txt'
            case "1d": return './data/intervals/1d.txt'
            case "2d": return './data/intervals/2d.txt'
            case "1w": return './data/intervals/1w.txt'
        }
    }

    let stringifiedEvents = JSON.stringify(events);
    fs.writeFile(file(time), stringifiedEvents, (err) => {
        if (err) throw err;
        console.log(`Overwrote ${file(time)}. Total: ${events.length} events.`);
    });
}