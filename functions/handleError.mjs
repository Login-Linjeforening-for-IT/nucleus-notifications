import sendNotification from "./sendNotification.mjs";

/**
 * Function for handling errors and notify maintenance crew.
 * 
 * @param {string} file File the error occured in
 * @param {string} err Error that occured
 * @param {string} topic Possibility to schedule to seperate topics in the future
 * @returns undefined
 */
export default function handleError (file, err, topic) {
    sendNotification(`Error in ${file}`, err, topic ? topic:"maintenance");
    console.log(`Error in ${file}`, err);
    return undefined;
}