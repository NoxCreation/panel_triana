import { prisma } from "@/utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateHash } from "@/utils/generateHash";

async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Proteger operaciones de escritura (solo ADMIN)
    if (req.method !== 'POST') {
        return res.status(403).json({ error: "Metodo no permitido" });
    }

    switch (req.method) {
        case 'POST':
            return handlePost(req, res);
        default:
            return res.status(405).json({ error: "Método no permitido." });
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { email, password, first_name, last_name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña son obligatorios." });
        }

        const hashedPassword = await generateHash(password)
        let imageUrl = null;

        // Comprobando que no exista user autenticado
        const countUsers = await prisma.user.count()
        if (countUsers > 0) { // Ir a la autenticacion
            return res.status(400).json({ error: "El sistema ya ha sido instalado." });
        }

        await prisma.user.create({
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

        return res.status(201).json({
            message: "Usuario creado de forma satisfactoria."
        });
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(400).json({ error: "El email ya está registrado." });
        }
        console.error(error);
        return res.status(500).json({ error: "Error al crear usuario." });
    }
}

export default handler;