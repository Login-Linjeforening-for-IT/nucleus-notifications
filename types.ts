export type DetailedProps = {
    endt: string
    publisht: string
    description: string
    organizerlogo: string
    organizerlink: string
    mazeref: string
}

export type DetailedEventProps = EventProps & DetailedProps

export type EventProps = {
    eventID: number
    parent: number
    organizer: string
    eventname: string
    startt: string
    audience: string
    category: CategoryProps
    image: string
    fblink: string
    discordlink: string
    roomno: string
    campus: string
    street: string
    postcode: number
    city: string
}

type CategoryProps = "tekkom" | "social" | "ctf" | "karrieredag" | "fadderuka" |
    "bedpres" | "login" | "annet" | "TEKKOM" | "SOCIAL" | "CTF" | "KARRIEREDAG" |
    "FADDERUKA" | "BEDPRES" | "LOGIN" | "ANNET"
