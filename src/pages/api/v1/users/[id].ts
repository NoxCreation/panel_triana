import authenticate, { AuthenticatedRequest } from "@/middleware/auth";
import { generateHash } from "@/utils/generateHash";
import { prisma } from "@/utils/prisma";
import type { NextApiResponse } from "next";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    const user = req.user;
    const { id } = req.query;

    if (typeof id !== 'string') {
        return res.status(400).json({ error: "ID inválido." });
    }

    // Solo admin puede modificar/eliminar; GET puede ser público (autenticado)
    if (req.method !== 'GET' && user?.role !== 'ADMIN') {
        return res.status(403).json({ error: "Acceso denegado. Se requieren permisos de administrador." });
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
        const user = await prisma.user.findUnique({
            where: { id },
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

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener usuario." });
    }
}

async function handlePut(req: AuthenticatedRequest, res: NextApiResponse, id: string) {
    try {
        const { email, password, first_name, last_name, photo, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        const data: any = {};
        if (email !== undefined) data.email = email;
        if (first_name !== undefined) data.first_name = first_name;
        if (last_name !== undefined) data.last_name = last_name;
        if (photo !== undefined) data.photo = photo;
        if (role !== undefined) data.role = role;
        if (password) {
            data.password_hash = await generateHash(password)
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data,
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

        return res.status(200).json(updatedUser);
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
            return res.status(400).json({ error: "El email ya está registrado por otro usuario." });
        }
        console.error(error);
        return res.status(500).json({ error: "Error al actualizar usuario." });
    }
}

async function handleDelete(req: AuthenticatedRequest, res: NextApiResponse, id: string) {
    try {
        if (req.user?.id === id) {
            return res.status(400).json({ error: "No puedes eliminarte a ti mismo." });
        }

        await prisma.user.delete({ where: { id } });
        return res.status(204).end();
    } catch (error: any) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }
        console.error(error);
        return res.status(500).json({ error: "Error al eliminar usuario." });
    }
}

export default authenticate(handler);