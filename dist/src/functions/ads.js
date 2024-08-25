var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchAdDetails, fetchAds } from "./fetch.js";
import { readFile, writeFile } from "./file.js";
import sendNotification from "./sendNotification.js";
export default function handleAds() {
    return __awaiter(this, void 0, void 0, function* () {
        const APIundetailedAds = yield fetchAds();
        const APIads = [];
        const a2h = yield readFile("a2h");
        const a6h = yield readFile("a6h");
        const a24h = yield readFile("a24h");
        const newA2H = [];
        const newA6H = [];
        const newA24H = [];
        for (const ad of APIundetailedAds) {
            const response = yield fetchAdDetails(ad);
            if (response) {
                APIads.push(response);
            }
        }
        for (const APIad of APIads) {
            const deadline = new Date(APIad.application_deadline).getTime() - new Date().getTime();
            if (deadline < 0) {
                console.log(`Ad ${APIad.id} has already passed. Ignoring.`);
                continue;
            }
            if (deadline < 7200000 && !hasAd({ ads: a2h, ad: APIad })) {
                console.log(`Ad ${APIad.id} is less than 2 hours away. Scheduling notification.`);
                sendNotification({ title: APIad.title_no, body: "Søknadsfrist om 2 timer!", topic: `a${APIad.id}`, screen: APIad });
                sendNotification({ title: APIad.title_en, body: "Application deadline in 2 hours!", topic: `a${APIad.id}`, screen: APIad });
                newA2H.push(APIad);
                continue;
            }
            if (deadline < 21600000 && !hasAd({ ads: a6h, ad: APIad })) {
                console.log(`Ad ${APIad.id} is less than 6 hours away. Scheduling notification.`);
                sendNotification({ title: APIad.title_no, body: "Søknadsfrist om 6 timer!", topic: `a${APIad.id}`, screen: APIad });
                sendNotification({ title: APIad.title_en, body: "Application deadline in 6 hours!", topic: `a${APIad.id}`, screen: APIad });
                newA6H.push(APIad);
                continue;
            }
            if (deadline < 86400000 && !hasAd({ ads: a24h, ad: APIad })) {
                console.log(`Ad ${APIad.id} is less than 24 hours away. Scheduling notification.`);
                const deadline = new Date();
                const localTime = deadline.toLocaleString('en-US', { timeZone: 'Europe/Oslo' });
                const localDeadline = new Date(localTime);
                const ampmDeadline = localDeadline.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                sendNotification({ title: APIad.title_no, body: `Søknadsfrist i morgen kl ${localDeadline.getHours()}:${localDeadline.getMinutes()}!`, topic: `a${APIad.id}`, screen: APIad });
                sendNotification({ title: APIad.title_no, body: `Application deadline tomorrow at ${ampmDeadline}!`, topic: `a${APIad.id}`, screen: APIad });
                newA24H.push(APIad);
            }
            if (deadline >= 86400000) {
                console.log(`Ad ${APIad.id} is ${deadline - 86400000} seconds away from being notified (24h left).`);
            }
        }
        writeFile({ fileName: "a2h", content: newA2H });
        writeFile({ fileName: "a6h", content: newA6H });
        writeFile({ fileName: "a24h", content: newA24H });
        console.log(`Wrote ${newA24H.length + newA2H.length + newA6H.length} ads to files.`);
    });
}
handleAds();
function hasAd({ ads, ad }) {
    const ids = [];
    for (let i = 0; i < ads.length; i++) {
        ids.push(ads[i].id);
    }
    if (ids.includes(ad.id)) {
        return true;
    }
    return false;
}
