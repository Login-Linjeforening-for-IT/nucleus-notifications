/**
 * Function for sleeping a given amount of time
 * 
 * @param {*} ms Milliseconds to sleep
 * @returns When finished sleeping
 */
export default async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}