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
    const user = req.user;

    // Proteger operaciones de escritura (solo ADMIN)
    if (req.method !== 'GET' && user?.role !== 'ADMIN') {
        return res.status(403).json({ error: "Acceso denegado. Se requieren permisos de administrador." });
    }

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
        const { where, orderBy, skip, take } = buildFilters<Prisma.LeadWhereInput>({
            config: {
                exactFields: ['email', 'first_name', 'last_name'],
                searchFields: ['email', 'first_name', 'last_name'],
                // rangeFields: ['createdAt'], // si quisieras filtrar por rango de fechas
            },
            query: req.query,
            defaultSort: 'createdAt:desc',
            defaultLimit: 10,
            maxLimit: 100,
        });

        const [leads, total] = await prisma.$transaction([
            prisma.lead.findMany({
                where,
                skip,
                take,
                orderBy,
                select: {
                    id: true,
                    email: true,
                    phone: true,
                    first_name: true,
                    last_name: true,
                    country_code: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            payments: true,
                        },
                    },
                },
            }),
            prisma.lead.count({ where }),
        ]);

        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = take;

        return res.status(200).json({
            data: leads,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener leads." });
    }
}

async function handlePost(req: AuthenticatedRequest, res: NextApiResponse) {
    try {
        const { email, password, first_name, last_name, photo, role = 'COMMON' } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son obligatorios." });
        }

        const hashedPassword = await generateHash(password)

        // Procesar imagen si viene en base64
        console.log(" Procesar imagen si viene en base64")
        let imageUrl = null;
        if (photo) {
            console.log("Es base64", isBase64(photo))
            if (isBase64(photo)) {
                // Subir a S3
                imageUrl = await uploadImageToS3(photo);
            } else if (isValidURL(photo)) {
                // Ya es una URL válida, guardarla directamente
                imageUrl = photo;
            } else {
                return res.status(400).json({
                    error: "Formato de imagen no válido. Debe ser base64 o URL."
                });
            }
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                first_name,
                last_name,
                photo: imageUrl
            },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                photo: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return res.status(201).json(newUser);
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(400).json({ error: "El email ya está registrado." });
        }
        console.error(error);
        return res.status(500).json({ error: "Error al crear usuario." });
    }
}

export default authenticate(handler);