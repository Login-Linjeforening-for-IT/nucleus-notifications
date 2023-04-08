/**
 * Returns the time till an event in seconds
 * 
 * @param {event} event 
 * 
 * @see offset()
 * 
 * @returns Seconds till event
 */
export default function timeToEvent (event) {

    const year     = new Date().getFullYear();                                                              // Current year
    let month    = 1 + new Date().getMonth();                                                               // Current month
    let day      = new Date().getDate();                                                                    // Current day
    let hour     = new Date().getHours();                                                                   // Current hour
    let minute   = new Date().getMinutes();                                                                 // Current minute
    let second   = new Date().getSeconds();

    if (month < 10) month = '0' + month;                                                                    // Checking and fixing missing 0
    if (day < 10) day = '0' + day;                                                                          // Checking and fixing missing 0
    if (hour < 10) hour = '0' + hour;                                                                       // Checking and fixing missing 0
    if (minute < 10) minute = '0' + minute;                                                                 // Checking and fixing missing 0
    if (second < 10) second = '0' + second;                                                                 // Checking and fixing missing 0

    const currentTime = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + 'Z';    // Current full date
    const dt1 = new Date(currentTime);                                                                      // Converting from string to date
    const dt2 = new Date(event.startt);                                                                     // Converting from string to date old and correct version
    let seconds = (dt2.getTime() - dt1.getTime()) / 1000;                                                   // Subtracting and dividing from milliseconds to seconds
    console.log(`${seconds} seconds till event ${event.eventID}.`);

    if (summertime()) return seconds-7200;                                                                  // Checks for and subtracts two hours during summertime
    else              return seconds-3600;                                                                  // Otherwise subtracts one hour during wintertime
} 

/**
 * Checks for summertime
 * 
 * @returns True if summertime otherwise false
 */
function summertime() {
    const date = new Date('2023-03-01');                                                                    // Date object for March 1st
    const offset = date.getTimezoneOffset();                                                                // Time zone offset in minutes

    if (offset < 0) return true;                                                                            // True if summertime
    else            return false;                                                                           // False if wintertime
}