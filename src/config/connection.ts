import 'dotenv/config'
import env from '../util/validateEnv'
import mongoose from 'mongoose'

const db = env.MONGO_CONNECTION_STRING
export default async function () {
    mongoose.set("strictQuery", true);
    await mongoose.connect(db)
        .then(() => {
            console.log("Database connected successfully")
        }).catch(console.error)
}