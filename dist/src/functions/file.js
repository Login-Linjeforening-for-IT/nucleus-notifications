var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import handleError, { fixJSONContent } from "./error.js";
import fs, { promises } from 'fs';
/**
 * Function for returning path to specified. Error if unknown argument.
 *
 * @param {filename} file   File argument to find full path for
 *
 * @see handleError(...)    Notifies the maintenance team of any error
 *
 * @returns {string} Full file path
 */
export default function file(file) {
    switch (file) {
        case "10m": return 'dist/src/data/intervals/events/10m.json';
        case "30m": return 'dist/src/data/intervals/events/30m.json';
        case "1h": return 'dist/src/data/intervals/events/1h.json';
        case "2h": return 'dist/src/data/intervals/events/2h.json';
        case "3h": return 'dist/src/data/intervals/events/3h.json';
        case "6h": return 'dist/src/data/intervals/events/6h.json';
        case "1d": return 'dist/src/data/intervals/events/1d.json';
        case "2d": return 'dist/src/data/intervals/events/2d.json';
        case "1w": return 'dist/src/data/intervals/events/1w.json';
        case "a2h": return 'dist/src/data/intervals/ads/2h.json';
        case "a6h": return 'dist/src/data/intervals/ads/6h.json';
        case "a24h": return 'dist/src/data/intervals/ads/24h.json';
        case "notified": return 'dist/src/data/notifiedEvents.json';
        case "slow": return 'dist/src/data/slowMonitored.json';
        default: {
            handleError({ file: "file", error: `Invalid file argument in file.ts: ${file}` });
            return "";
        }
    }
}
/**
 * Writes content to file
 *
 * @param fileName       Filename to write to
 * @param content        Content to write to file
 *
 * @see handleError(...) Notifies the maintenance team of any error
 * @see file(...)        Returns full file path of given argument
 */
export function writeFile({ fileName, content, removeBrackets }) {
    // Fetches full file path for the array to write to file
    const File = file(fileName);
    // Stringifies content to write to file
    let stringifiedContent = content ? JSON.stringify(content) : "[]";
    if (removeBrackets) {
        stringifiedContent = content;
    }
    // Writes content or empty brackets to file 
    fs.writeFile(File, stringifiedContent, (error) => {
        // Returns and handles any errors while writing
        if (error) {
            return handleError({ file: "writeFile", error: JSON.stringify(error) });
        }
        // Logs success
        console.log(`Overwrote ${fileName}. Content: ${content ? true : false}.`);
    });
}
/**
 * Fetches interval files
 *
 * @param {string} arg      Time interval for the specified file
 *
 * @see handleError(...)    Notifies the maintenance team of any error
 * @see fixJSONContent(...) Tries to fix malformed json content in input file
 *
 * @returns                 Contents of given file
 */
export function readFile(arg, stop) {
    return __awaiter(this, void 0, void 0, function* () {
        // Defines file to read from
        const File = file(arg);
        yield createPath({ path: `/${File}` });
        // Returns a promise
        return new Promise((res) => {
            // Reads file
            fs.readFile(File, (error, data) => __awaiter(this, void 0, void 0, function* () {
                // Handles potential error
                if (error) {
                    if ((error === null || error === void 0 ? void 0 : error.errno) === -2) {
                        createPath({ path: File });
                        const content = JSON.parse(data.toString());
                        if (content)
                            res(content);
                    }
                    res(handleError({ file: "readFile", error: JSON.stringify(error) }));
                }
                try {
                    // Tries to parse the json to string
                    const content = JSON.parse(data.toString());
                    // If the content is defined resolves successfully
                    if (content)
                        res(content);
                    // Otherwise resolves with error, and handles the error
                    else
                        res(handleError({ file: File, error: JSON.stringify(error) }));
                    // Handles case where the json cannot be parsed
                }
                catch (error) {
                    // Stopping the process if the file has already been fixed unsuccessfully
                    if (stop)
                        return handleError({ file: "readFile", error: JSON.stringify(error) });
                    // Most likely there is an error with the json. Trying to fix malformed json content
                    yield fixJSONContent(arg, error);
                    yield readFile(arg, true);
                }
            }));
        });
    });
}
export function createPath({ path }) {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        const fullPath = `${cwd}${path}`;
        const entries = fullPath.split('/');
        let currentPath = '';
        for (let i = 1; i < entries.length; i++) {
            currentPath += `/${entries[i]}`;
            try {
                yield createFileOrFolder({ entry: currentPath });
            }
            catch (error) {
                console.error(`Failed to create entry ${currentPath}:`, error);
                return;
            }
        }
    });
}
function createFileOrFolder({ entry }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (entry.includes('.')) {
                try {
                    yield promises.access(entry);
                }
                catch (error) {
                    yield promises.writeFile(entry, '[]');
                    console.log(`File created: ${entry}`);
                }
            }
            else {
                try {
                    yield promises.access(entry);
                }
                catch (error) {
                    yield promises.mkdir(entry, { recursive: true });
                    console.log(`Folder created: ${entry}`);
                }
            }
        }
        catch (error) {
            throw new Error(`Failed to create ${entry}: ${error}`);
        }
    });
}
export function removeHealthyFile() {
    const healthyFilePath = './tmp/healthy.txt';
    fs.unlink(healthyFilePath, (err) => {
        if (err)
            throw err;
        console.log('Healthy file removed successfully.');
    });
}
