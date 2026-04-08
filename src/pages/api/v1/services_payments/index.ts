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

    if (req.method !== 'GET') {
        return res.status(403).json({ error: "Método no permitido." });
    }

    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        default:
            return res.status(405).json({ error: "Método no permitido." });
    }
}

async function handleGet(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        const { where, orderBy, skip, take } = buildFilters<Prisma.PaymentWhereInput>({
            config: {
                exactFields: ['lead.first_name'],
                searchFields: ['lead.first_name'],
                // rangeFields: ['createdAt'], // si quisieras filtrar por rango de fechas
            },
            query: req.query,
            defaultSort: 'createdAt:desc',
            defaultLimit: 10,
            maxLimit: 100,
        });

        const [payments, total] = await prisma.$transaction([
            prisma.payment.findMany({
                where,
                skip,
                take,
                orderBy,
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
            }),
            prisma.payment.count({ where }),
        ]);

        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = take;

        return res.status(200).json({
            data: payments,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener payments." });
    }
}

export default authenticate(handler);