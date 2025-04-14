import dotenv from 'dotenv'

dotenv.config()

const { FIREBASE_SECRET } = process.env

if (!FIREBASE_SECRET) {
    throw new Error("Missing FIREBASE_SECRET.")
}

const SERVICE_ACCOUNT = JSON.parse(FIREBASE_SECRET)
export default SERVICE_ACCOUNT as object
