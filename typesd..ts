type DetailedProps = {
    endt: string
    publisht: string
    description: string
    organizerlogo: string
    organizerlink: string
    mazeref: string
}

type DetailedEventProps = EventProps & DetailedProps

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

type CategoryProps = 
    "tekkom" 
    | "social"
    | "ctf"
    | "karrieredag"
    | "fadderuka"
    | "bedpres"
    | "login"
    | "annet"
    | "TEKKOM"
    | "SOCIAL"
    | "CTF"
    | "KARRIEREDAG"
    | "FADDERUKA"
    | "BEDPRES"
    | "LOGIN"
    | "ANNET"

type AdProps = {
    id: number
    highlight: boolean
    title_no: string
    title_en: string
    position_title_no: string
    position_title_en: string
    job_type: string
    time_publish: string
    application_deadline: string
    organization_shortname: string
    organization_name_no: string
    organization_name_en: string
    organization_logo: string
    skills: string[]
    cities: string[]
}

type ExtraAdProps = {
    visible: boolean
    description_short_no: string
    description_short_en: string
    description_long_no: string
    description_long_en: string
    banner_image: string
    organization: string
    application_url: string
    updated_at: string
    created_at: string
    deleted_at: string
}

type AdOrganizationProps = {
    shortname: string
    name_no: string
    name_en: string
    description_no: string
    description_en: string
    link_homepage: string
    link_linkedin: string
    link_facebook: string
    link_instagram: string
    logo: string
    updated_at: string
    created_at: string
    deleted_at: string
    }

type DetailedAd = AdProps & ExtraAdProps & AdOrganizationProps
