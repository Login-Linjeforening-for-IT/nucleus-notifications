import { fetchAdDetails, fetchAds } from "./fetch.js"

export default async function handleAds() {
    const APIundetailedAds = await fetchAds()
    const APIads = [] as DetailedAd[]

    for (const ad of APIundetailedAds) {
        const response = await fetchAdDetails(ad)
        if (response) {
            APIads.push(response)
        }
    }

    for (const APIad of APIads) {
        const deadline = new Date(APIad.application_deadline).getTime() - new Date().getTime()
        if (deadline < 86400000) {
            console.log('Less than 24h')
        }

        if (deadline < 21600000) {
            console.log('Deadline in 6h')
        }

        if (deadline < 7200000) {
            console.log('Deadline in 2h')
        }
    }
}

handleAds()