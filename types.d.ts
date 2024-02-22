declare var stable: boolean 
declare var startTime: string

type EventProps = {
    id: number
    name_no: string
    name_en: string
    highlight: boolean
    canceled: boolean
    full: boolean
    time_type: string
    time_start: string
    time_end: string
    time_publish: string
    image_small: string
    location_name_no: string
    location_name_en: string
    category_color: string
    category_name_no: string
    category_name_en: string
}

type DetailedEventResponse = {
    event: DetailedEvent
    category: Category
    organizations: Organization[]
    audiences: Audience[]
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

type Organization = {
    shortname: string
    logo: string
    name_no: string
    name_en: string
    description_no: string
    description_en: string
    link_homepage: string
    link_linkedin: string
    link_facebook: string
    link_instagram: string
}

type Audience = {
    id: number
    name_no: string
    name_en: string
    description_no: string
    description_en: string
}

type Category = {
    id: number
    color: string
    name_no: string
    name_en: string
    description_no: string
    description_en: string
    updated_at: string
    created_at: string
}

type DetailedEvent = {
    id: number | string
    visible: boolean
    name_no: string
    name_en: string
    description_no: string
    description_en: string
    informational_no: string
    informational_en: string
    time_type: string
    time_start: string
    time_end: string
    time_publish: string
    time_signup_release: string
    time_signup_deadline: string
    canceled: boolean
    digital: boolean
    highlight: boolean
    image_small: string
    image_banner: string
    link_facebook: string
    link_discord: string
    link_signup: string
    link_stream: string
    capacity: number | null
    full: boolean
    category: number
    location: null,
    parent: null,
    rule: null,
    updated_at: string
    created_at: string
    deleted_at: string
    category_name_no: string
    category_name_en: string
}

