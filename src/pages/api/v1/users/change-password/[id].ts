import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/utils/prisma";
import { checkPassword, generateHash } from "@/utils/generateHash";

export const config = {
    api: {
        bodyParser: true,
    },
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>,
) {

    if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const {
                currentPassword,
                newPassword,
                confirmPassword
            } = req.body;

            if (!currentPassword || !newPassword || !confirmPassword) {
                return res.status(400).json({ error: 'Falta el campos por enviar' });
            }

            const user = await prisma.user.findUnique({
                where: {
                    id: id as string
                }
            });

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const valid = await checkPassword(currentPassword, user.password_hash);
            if (!valid) {
                return res.status(400).json({ error: "La contraseña actual es incorrecta" });
            }

            if (newPassword != confirmPassword)
                return res.status(400).json({ error: "Las contraseñas no coinciden." });

            const newPasswordHash = await generateHash(newPassword);

            const updatedPasswordUser = await prisma.user.update({
                where: { id: id as string },
                data: {
                    password_hash: newPasswordHash
                },
                select: {
                    id: true,
                    photo: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            return res.status(200).json({
                success: true,
                message: 'Contraseña actualizado correctamente',
                data: updatedPasswordUser
            });
        }
        catch (error) {
            console.error('Error actualizando contraseña de usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
        }
    }

    return res.status(405).json({ error: 'Método no permitido' });
}
