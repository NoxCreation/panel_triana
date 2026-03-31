import authenticate, { AuthenticatedRequest } from "@/middleware/auth";
import { prisma } from "@/utils/prisma";
import type { NextApiResponse } from "next";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        case 'POST':
            return handlePost(req, res);
        default:
            return res.status(405).json({ error: "Método no permitido." });
    }
}

async function handleGet(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        const landing_content = await prisma.landing.findFirst()

        if (!landing_content) {
            return res.status(200).json({
                content: {},
            });
        }
        else {
            return res.status(200).json({
                content: landing_content.content,
            });
        }
    } catch (error) {
        console.error("Error en POST stock:", error);
        return res.status(500).json({ error: "Error al actualizar stock." });
    }
}

async function handlePost(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        const { content } = req.body;

        const landing_content = await prisma.landing.findFirst()

        if (!landing_content) {
            await prisma.landing.create({
                data: {
                    content
                }
            })
        }
        else {
            await prisma.landing.update({
                where: {
                    id: landing_content.id
                },
                data: {
                    content
                }
            })
        }

        return res.status(201).json({
            message: "Contenido guardado",
        });
    } catch (error) {
        console.error("Error en POST stock:", error);
        return res.status(500).json({ error: "Error al actualizar stock." });
    }
}

export default authenticate(handler);