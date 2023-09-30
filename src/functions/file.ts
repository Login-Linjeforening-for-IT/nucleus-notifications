import handleError, { heal } from "./error.js"
import * as fs from 'fs'

type writeFileProps = {
    fileName: string
    content: any
    removeBrackets?: boolean
}

/**
 * Function for returning path to specified. Error if unknown argument.
 * 
 * @param {filename} file   File argument to find full path for
 * 
 * @see handleError(...)    Notifies the maintenance team of any error
 * 
 * @returns {string} Full file path
 */
export default function file(file: string): string {
    switch (file) {
        case "10m":         return 'dist/dist/src/data/intervals/10m.txt'
        case "30m":         return 'dist/dist/src/data/intervals/30m.txt'
        case "1h":          return 'dist/dist/src/data/intervals/1h.txt'
        case "2h":          return 'dist/dist/src/data/intervals/2h.txt'
        case "3h":          return 'dist/dist/src/data/intervals/3h.txt'
        case "6h":          return 'dist/dist/src/data/intervals/6h.txt'
        case "1d":          return 'dist/dist/src/data/intervals/1d.txt'
        case "2d":          return 'dist/dist/src/data/intervals/2d.txt'
        case "1w":          return 'dist/dist/src/data/intervals/1w.txt'
        case "notified":    return 'dist/dist/src/data/notifiedEvents.txt'
        case "slow":        return 'dist/dist/src/data/slowMonitored.txt'
        case "info":        return 'dist/dist/src/data/info.js'
        default: {
            handleError({file: "file", error: `Invalid file argument in file.ts: ${file}`})
            return ""
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
export function writeFile({fileName, content, removeBrackets}: writeFileProps) {
    // Fetches full file path for the array to write to file
    let File = file(fileName)

    // Stringifies content to write to file
    let stringifiedContent = content ? JSON.stringify(content) : "[]"
    
    if (removeBrackets) {
        stringifiedContent = content
    }

    // Writes content or empty brackets to file 
    fs.writeFile(File, stringifiedContent, (error) => {
        // Returns and handles any errors while writing
        if (error) {
            return handleError({file: "writeFile", error: JSON.stringify(error)})
        }

        // Logs success
        console.log(`Overwrote ${fileName}. Content: ${content ? true : false}.`)
    })
}

/**
 * Fetches interval files 
 *
 * @param {string} arg      Time interval for the specified file
 * 
 * @see handleError(...)    Notifies the maintenance team of any error
 * @see heal(...)           Tries to fix any unreadable file
 * 
 * @returns                 Contents of given file
 */
export async function readFile(arg: string, stop?: boolean): Promise<unknown> {
    // Defines file to read from
    let File = file(arg)

    // Returns a promise
    return new Promise((res) => {
        // Reads file
        fs.readFile(File, async (error, data) => {
            
            // Handles potential error
            if (error) res(handleError({file: "readFile", error: JSON.stringify(error)}))
            try {
                // Tries to parse the json to string
                const content = JSON.parse(data.toString())

                // If the content is defined resolves successfully
                if (content) res(content)

                // Otherwise resolves with error, and handles the error
                else res(handleError({file: File, error: JSON.stringify(error)}))
            
            // Handles case where the json cannot be parsed
            } catch (error) {
                // Stopping the process if the file has already been healed unsuccessfully
                if (stop) return handleError({file: "readFile", error: JSON.stringify(error)})

                // Most likely there is an error with the json. Trying to heal
                await heal(arg)
                await readFile(arg, true)
            }
        })
    })
}
