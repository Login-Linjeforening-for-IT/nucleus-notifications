import { DetailedEventProps } from "../../types"

/**
 * Fetches the joinlink of an event, null if no joinlink was found
 * 
 * @param {object} event Event to search
 * 
 * @returns string or null
 */
export default function joinlink(event: DetailedEventProps): string | null {

    let description = event.description

    if (description) {
        
        // Catches google and microsoft form links
        let formStart = description.lastIndexOf('https://forms')
        let formEnd = description.lastIndexOf("</a>")
        
        // Catches tikkio links
        let tikkioStart = description.lastIndexOf('https://tikkio')
        let tikkioEnd = description.lastIndexOf('</a>')

        // Catches nettskjema links
        let netStart = description.lastIndexOf('https://nettskjema.no')
        let netEnd = description.lastIndexOf('</a>')

        // Extracts the links from the description
        let formLink = description.slice(formStart, formEnd)
        let tikkioLink = description.slice(tikkioStart, tikkioEnd)
        let netLink = description.slice(netStart, netEnd)

        // Trims and returns link if they are found
        if (formLink)    return formLink.trim()
        if (tikkioLink)  return tikkioLink.trim()
        if (netLink)     return netLink.trim()

        // Returns null if no link was found
        return null
    
    // Returns null if no description was found
    } else return null
}
