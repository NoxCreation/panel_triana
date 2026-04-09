import authenticate, { AuthenticatedRequest } from "@/middleware/auth";
import { prisma } from "@/utils/prisma";
import { buildFilters } from "@/utils/filters";
import type { NextApiResponse } from "next";
import { Prisma } from "@/generate/prisma/client";
import { generateHash } from "@/utils/generateHash";
import { isBase64 } from "@/utils/isBase64";
import { uploadImageToS3 } from "@/utils/uploadImageToS3";
import { isValidURL } from "@/utils/isValidURL";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {

    if (req.method !== 'GET' && req.method !== 'PUT') {
        return res.status(403).json({ error: "Método no permitido." });
    }

    if (req.method == 'GET') {
        const landing = await prisma.landing.findFirst({
            select: {
                privacy_policy_web: true,
            },
        });
        const privacy_policy_web = landing.privacy_policy_web

        return res.status(200).json({
            content: privacy_policy_web
        })
    }
    else if (req.method == 'PUT') {
        const { content } = req.body
        const id = (await prisma.landing.findFirst()).id
        await prisma.landing.update({
            where: { id },
            data: { privacy_policy_web: content }
        })
        return res.status(200).json({
            content
        })
    }

}


export default authenticate(handler);