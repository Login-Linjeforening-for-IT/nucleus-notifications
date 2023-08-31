import automatedNotifications from "./automatedNotifications.js";
import slowMonitored from "./slowMonitored.js";
import { writeFile } from "./functions/file.js";

/**
 * Test function for the repository. Will run for 5 minutes then put the
 * repository into production if no errors are found.
 * 
 * @see automatedNotifications()    Main entry point of application, running every minute
 * @see slowMonitored()             Entry point for events that does not need to be checked often
 * @see writeFile()                 Writes given content to given file
 */
export async function test() {
    // Defines test count
    let testCount = 0

    // Writes start time to file
    await writeFile("info", { startTime: new Date().toISOString() })

    // Runs the two entry points of the application 5 times to ensure stability
    do {
        // Runs main application entry points
        automatedNotifications()
        slowMonitored()

        // Increases count
        testCount++
    
        // Times out for 1 minute between each run to ensure stability
        await new Promise(resolve => setTimeout(resolve, 60000));

    // Runs 5 times before continuing
    } while (testCount < 5)

    // Logs success
    console.log("No errors found. Putting repository into production.")
}