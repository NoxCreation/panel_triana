import authenticate, { AuthenticatedRequest } from "@/middleware/auth";
import { generateHash } from "@/utils/generateHash";
import { prisma } from "@/utils/prisma";
import type { NextApiResponse } from "next";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: "ID inválido." });
    }

    switch (req.method) {
        case 'GET':
            return handleGet(req, res, id);
        case 'PUT':
            return handlePut(req, res, id);
        case 'DELETE':
            return handleDelete(req, res, id);
        default:
            return res.status(405).json({ error: "Método no permitido." });
    }
}

async function handleGet(req: AuthenticatedRequest, res: NextApiResponse, id: string) {
    try {
        const lead = await prisma.lead.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                country_code: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!lead) {
            return res.status(404).json({ error: "Lead no encontrado." });
        }

        return res.status(200).json(lead);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener lead." });
    }
}

async function handlePut(req: AuthenticatedRequest, res: NextApiResponse, id: string) {
    try {
        const { active } = JSON.parse(req.body);

        const existingPayment = await prisma.payment.findUnique({ where: { id } });
        if (!existingPayment) {
            return res.status(404).json({ error: "Payment no encontrado." });
        }

        const data: any = {};
        if (active !== undefined) data.active = active == "true" ? true : false;

        const updatedPayment = await prisma.payment.update({
            where: { id },
            data,
            select: {
                id: true,
                lead: true,
                amount: true,
                service: true,
                history: {
                    orderBy: { createdAt: 'desc' },
                },
                active: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(200).json(updatedPayment);
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(400).json({ error: "El email ya está registrado por otro usuario." });
        }
        console.error(error);
        return res.status(500).json({ error: "Error al actualizar lead." });
    }
}

async function handleDelete(req: AuthenticatedRequest, res: NextApiResponse, id: string) {
    try {
        if (req.user?.id === id) {
            return res.status(400).json({ error: "No puedes eliminarte a ti mismo." });
        }

        await prisma.lead.delete({ where: { id } });
        return res.status(204).end();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Lead no encontrado." });
        }
        console.error(error);
        return res.status(500).json({ error: "Error al eliminar lead." });
    }
}

export default authenticate(handler);