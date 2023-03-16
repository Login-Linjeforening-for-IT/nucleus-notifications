/**
 * Fetches the joinlink of an event, null if no joinlink was found
 * 
 * @param {object} event Event to search
 * 
 * @returns string or null
 */
export default function joinlink(event) {

    let d = event.description;

    if(d) {
        
        let formStart = d.lastIndexOf('https://forms');
        let formEnd = d.lastIndexOf("</a>");
        
        let tikkioStart = d.lastIndexOf('https://tikkio');
        let tikkioEnd = d.lastIndexOf('</a>');

        let netStart = d.lastIndexOf('https://nettskjema.no');
        let netEnd = d.lastIndexOf('</a>')

        let formLink = d.slice(formStart, formEnd);
        let tikkioLink = d.slice(tikkioStart, tikkioEnd);
        let netLink = d.slice(netStart, netEnd);

        if(formLink)    return formLink.trim();
        if(tikkioLink)  return tikkioLink.trim();
        if(netLink)     return netLink.trim();

        return null;
    } else return null;
}