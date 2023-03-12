/**
 * Function for fetching a emoji to include in a string.
 * @param {object} props Event object
 * @returns Emoji as string
 */
export default function fetchEmoji(props) {
    switch ((props.category).toLowerCase()) {
      case 'tekkom':        return '🍕'
      case 'karrieredag':   return '👩‍🎓'
      case 'cft':           return '🧑‍💻'
      case 'fadderuka':     return '🍹'
      case 'social':        return '🥳'
      case 'bedpres':       return '👩‍💼'
      case 'login':         return '🚨'
      default:              return '💻'
    }
}