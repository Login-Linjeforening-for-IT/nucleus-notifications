import * as fs from 'fs';

/**
 * Fetches interval files 

 * @param {string} time Time interval for the specified file
 * @returns Events from specified file
 */
export default function fetchInterval(time) {
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

    return new Promise((res, rej) => {
        fs.readFile(file(time), (err, data) => {
            if (err) rej (err);
            let events = JSON.parse(data.toString());
            res (events);
        })
    })
}