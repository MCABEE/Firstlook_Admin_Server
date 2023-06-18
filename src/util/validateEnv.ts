import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    JWT_ACESS_SECRET: str(),
    JWT_REFRESH_SECRET: str(),
    CLOUDFLARE_API_KEY: str(),
    CLOUDFLARE_ZONE_ID: str(),
    CLOUDFLARE_ACCOUNT_ID: str(),
})