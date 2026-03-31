import authNext from './options'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    authNext(req, res)
}
