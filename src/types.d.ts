declare var stable: boolean
declare var startTime: string

type time_type = 'default' | 'no_end' | 'whole_day' | 'to_be_determined'

type EventProps = {
    visible: boolean
    name_no: string
    name_en: string
    description_no: string
    description_en: string
    informational_no: string
    informational_en: string
    time_type: time_type
    time_start: string
    time_end: string
    time_publish: string
    time_signup_release: string | null
    time_signup_deadline: string | null
    canceled: boolean
    digital: boolean
    highlight: boolean
    image_small: string | null
    image_banner: string | null
    link_facebook: string | null
    link_discord: string | null
    link_signup: string | null
    link_stream: string | null
    capacity: number | null
    is_full: boolean
}

type GetCategoryProps = {
    id: number
    name_no: string
    name_en: string
    color: string
    created_at: string
    updated_at: string
}

type GetEventProps = EventProps & {
    id: number
    category: GetCategoryProps
    location: GetLocationProps | null
    parent_id: number | null
    rule: GetRuleProps | null
    audience: GetAudienceProps | null
    organization: GetOrganizationProps | null
    updated_at: string
    created_at: string
}

type EventLocation = {
    name_no: string
    name_en: string
    type: string
    mazemap_campus_id: number | null
    mazemap_poi_id: number | null
    address_street: string | null
    address_postcode: number | null
    city_name: string | null
    coordinate_lat: number | null
    coordinate_lon: number | null
    url: string | null
}

type GetLocationProps = EventLocation & {
    id: number
    created_at: string
    updated_at: string
}

type Rule = {
    name_no: string
    name_en: string
    description_no: string
    description_en: string
}

type GetRuleProps = Rule & {
    id: number
    created_at: string
    updated_at: string
}

type GetAudienceProps = {
    id: number
    name_no: string
    name_en: string
    created_at: string
    updated_at: string
}

type GetEventsProps = {
    events: GetEventProps[]
    total_count: number
}

type GetOrganizationProps = Organization & {
    id: number
    created_at: string
    updated_at: string
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

type GetJobsProps = {
    jobs: GetJobProps[]
    total_count: number
}

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

type Organization = {
    name_no: string
    name_en: string
    description_no: string
    description_en: string
    link_homepage: string | null
    link_linkedin: string | null
    link_facebook: string | null
    link_instagram: string | null
    logo: string | null
}