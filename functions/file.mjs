import handleError from "./handleError.mjs";

/**
 * Function for returning path to specified
 * 
 * @param {filename} arg 
 * @returns 
 */
export default function file(arg) {
    switch (arg) {
        case "10m":         return './data/intervals/10m.txt';
        case "30m":         return './data/intervals/30m.txt';
        case "1h":          return './data/intervals/1h.txt';
        case "2h":          return './data/intervals/2h.txt';
        case "3h":          return './data/intervals/3h.txt';
        case "6h":          return './data/intervals/6h.txt';
        case "1d":          return './data/intervals/1d.txt';
        case "2d":          return './data/intervals/2d.txt';
        case "1w":          return './data/intervals/1w.txt';
        case "notified":    return './data/notifiedEvents.txt';
        case "slow":        return './data/slowMonitored.txt';
        default:            return handleError("file.mjs", `Invalid file argument in file.mjs: ${arg}`);
    };
};