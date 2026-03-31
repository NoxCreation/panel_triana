import { IncomingMessage } from "http";
import { getToken } from "next-auth/jwt";

export default async function is_auth(req: IncomingMessage & { cookies: Partial<{ [key: string]: string; }>; }) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
        const tokenValid = token != undefined
        if (tokenValid) {
            return true
        }
        return false
    }
    catch { }
    return false
}
