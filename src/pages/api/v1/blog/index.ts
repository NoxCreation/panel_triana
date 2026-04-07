import authenticate, { AuthenticatedRequest } from "@/middleware/auth";
import { prisma } from "@/utils/prisma";
import { buildFilters } from "@/utils/filters";
import type { NextApiResponse } from "next";
import { Prisma } from "@/generate/prisma/client";
import { generateHash } from "@/utils/generateHash";
import { isBase64 } from "@/utils/isBase64";
import { uploadImageToS3 } from "@/utils/uploadImageToS3";
import { isValidURL } from "@/utils/isValidURL";
import { generarSlug } from "@/utils/generarSlug";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {

    if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT') {
        return res.status(403).json({ error: "Metodo no permitido" });
    }

    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        case 'POST':
            return handlePost(req, res);
        case 'PUT':
            return handlePut(req, res);
        default:
            return res.status(405).json({ error: "Método no permitido." });
    }
}

async function handleGet(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        const { where, orderBy, skip, take } = buildFilters<Prisma.ArticleWhereInput>({
            config: {
                exactFields: ['title'],
                searchFields: ['title'],
                // rangeFields: ['createdAt'], // si quisieras filtrar por rango de fechas
            },
            query: req.query,
            defaultSort: 'createdAt:desc',
            defaultLimit: 10,
            maxLimit: 100,
        });

        const [articles, total] = await prisma.$transaction([
            prisma.article.findMany({
                where,
                skip,
                take,
                orderBy,
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    mini_description: true
                }
            }),
            prisma.article.count({ where }),
        ]);

        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = take;

        return res.status(200).json({
            data: articles,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener usuarios." });
    }
}

async function handlePost(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        const {
            title,
            mini_description,
            thumbnail,
            description
        } = JSON.parse(req.body);

        await prisma.article.create({
            data: {
                title,
                slug: generarSlug(title),
                mini_description,
                thumbnail,
                description
            }
        })
        console.log("creado")

        return res.status(200).json({});
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(400).json({ error: "El email ya está registrado." });
        }
        console.error(error);
        return res.status(500).json({ error: "Error al crear usuario." });
    }
}

async function handlePut(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        const {
            id,
            title,
            mini_description,
            thumbnail,
            description
        } = JSON.parse(req.body);

        console.log("slug", generarSlug(title))

        await prisma.article.update({
            where: {
                id
            },
            data: {
                title,
                slug: generarSlug(title),
                mini_description,
                thumbnail,
                description
            }
        })

        return res.status(200).json({});
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(400).json({ error: "El email ya está registrado." });
        }
        console.error(error);
        return res.status(500).json({ error: "Error al crear usuario." });
    }
}

export default authenticate(handler);