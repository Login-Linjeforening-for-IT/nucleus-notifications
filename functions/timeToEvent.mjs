/**
 * Returns the time till an event in seconds
 * 
 * @param {event} event 
 * 
 * @returns Seconds till event
 */
export default function timeToEvent (event) {
   
    var year     = new Date().getFullYear()                                                                 // Current year
    var month    = 1 + new Date().getMonth()                                                                // Current month
    var day      = new Date().getDate()                                                                     // Current day
    var hour     = new Date().getHours()                                                                    // Current hour
    var minute   = new Date().getMinutes()                                                                  // Current minute
    var second   = new Date().getSeconds()

    if(month < 10) month = '0' + month                                                                      // Checking and fixing missing 0
    if(day < 10) day = '0' + day                                                                            // Checking and fixing missing 0
    if(hour < 10) hour = '0' + hour                                                                         // Checking and fixing missing 0
    if(minute < 10) minute = '0' + minute                                                                   // Checking and fixing missing 0
    if(second < 10) second = '0' + second                                                                   // Checking and fixing missing 0

    var currentTime = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + 'Z'       // Current full date
    const dt1 = new Date(currentTime);                                                                      // Converting from string to date
    const dt2 = new Date(event.startt);                                                                     // Converting from string to date old and correct version
    const seconds = (dt2.getTime() - dt1.getTime()) / 1000;                                                 // Subtracting and dividing from milliseconds to seconds
    console.log(`${seconds} seconds till event ${event.eventID}.`)
    return seconds-3600;                                                                                    // Returning seconds minus one hour to compencate for GMT time.
} 