import { checkPassword } from '@/utils/generateHash';
import { prisma } from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    try {
        const { email, password } = req.body;

        // Validar campos requeridos
        if (!email || !password) {
            return res.status(400).json({
                error: 'Usuario/Email y contraseña son requeridos',
            });
        }

        // Buscar usuario en la base de datos
        const user_system = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user_system) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
            });
        }

        // Verificar contraseña
        const isPasswordValid = await checkPassword(password, user_system.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
            });
        }

        // Generar token JWT
        const secretKey = process.env.NEXTAUTH_SECRET as string;
        const token = jwt.sign({
            ...{
                ...user_system,
                photo: ''
            }
        }, secretKey, { expiresIn: '1d' });

        // Responder con el token
        res.status(200).json({
            success: true,
            token,
            user: {
                ...user_system
            },
            expiresIn: '1d',
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
        });
    }
}