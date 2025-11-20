import dotenv from 'dotenv'

dotenv.config()

const { FIREBASE_SECRET } = process.env

if (!FIREBASE_SECRET) {
    throw new Error("Missing FIREBASE_SECRET.")
}

const config = {
    api: "https://workerbee.login.no/api/v2",
    test_api: "https://dev.workerbee.login.no/api/v2",
    service_account: JSON.parse(FIREBASE_SECRET)
}

export default config
