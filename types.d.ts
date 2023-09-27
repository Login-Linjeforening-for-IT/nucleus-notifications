type EventProps = {
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

type DetailedProps = {
    endt: string
    publisht: string
    description: string
    organizerlogo: string
    organizerlink: string
    mazeref: string
}

type DetailedEventProps = EventProps & DetailedProps
