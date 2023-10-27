/**
 * Fetches the joinlink of an event, null if no joinlink was found
 * 
 * @param {object} event Event to search
 * 
 * @returns string or null
 */
export default function joinlink(event: DetailedEventProps): string | null {

    const description = event.description

    if (!description) return null
        
    // Catches google and microsoft form links
    const formStart = description.lastIndexOf('https://forms')
    const formEnd = description.lastIndexOf("</a>")
    
    // Catches tikkio links
    const tikkioStart = description.lastIndexOf('https://tikkio')
    const tikkioEnd = description.lastIndexOf('</a>')

    // Catches nettskjema links
    const netStart = description.lastIndexOf('https://nettskjema.no')
    const netEnd = description.lastIndexOf('</a>')

    // Extracts the links from the description
    const formLink = description.slice(formStart, formEnd)
    const tikkioLink = description.slice(tikkioStart, tikkioEnd)
    const netLink = description.slice(netStart, netEnd)

    // Trims and returns link if they are found
    if (formLink)    return formLink.trim()
    if (tikkioLink)  return tikkioLink.trim()
    if (netLink)     return netLink.trim()

    // Returns null if no link was found
    return null
}
