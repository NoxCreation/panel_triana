import { verifyToken } from '@/utils/generateHash';
import { prisma } from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends NextApiRequest {
    user?: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        [key: string]: any;
    };
    session?: any;
}

const authenticate = (handler: any) => {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        try {
            // 1. Verificar que el header de autorización existe
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    error: 'Token de autenticación requerido',
                });
            }

            // 2. Extraer el token
            const token = authHeader.substring(7);

            // 3. Verificar el token JWT
            let decoded: any;
            try {
                // Primero intentamos con tu función verifyToken (si existe)
                decoded = verifyToken(token);
            } catch (jwtError) {
                // Si falla, intentamos con jwt.verify
                const secretKey = process.env.NEXTAUTH_SECRET as string;
                decoded = jwt.verify(token, secretKey);
            }

            // 4. Verificar que el token tiene los campos necesarios
            if (!decoded.id) {
                return res.status(401).json({
                    success: false,
                    error: 'Token inválido: falta información de sesión',
                });
            }

            // 5. Buscar la sesión en la base de datos
            const user = await prisma.user.findUnique({
                where:{
                    id: decoded.id
                }
            })

            // 6. Verificar que la sesión existe y es válida
            /* if (!session) {
                return res.status(401).json({
                    success: false,
                    error: 'Sesión no encontrada, expirada o inválida',
                });
            } */

            // 7. Verificar que el token de acceso coincida (protección contra token reutilizado)
            /* if (session.accessToken !== token) {
                // Invalidar esta sesión por seguridad
                await prisma.session.update({
                    where: { id: session.id },
                    data: { isValid: false }
                });

                return res.status(401).json({
                    success: false,
                    error: 'Token de acceso inválido',
                });
            } */

            // 8. Verificar que el usuario existe y está activo
            /* if (!session.user) {
                return res.status(401).json({
                    success: false,
                    error: 'Usuario no encontrado',
                });
            } */

            // 9. Actualizar última vez usado (opcional, pero recomendado)
            /* await prisma.session.update({
                where: { id: session.id },
                data: { lastUsedAt: new Date() }
            }); */

            // 10. Agregar usuario y sesión al request
            req.user = user

            //req.session = session;

            // 11. Ejecutar el handler original
            return handler(req, res);

        } catch (error: any) {
            console.error("Error en autenticación:", error);

            // Manejo específico de errores JWT
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token expirado',
                });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token inválido',
                });
            }

            return res.status(401).json({
                success: false,
                error: 'Error de autenticación',
            });
        }
    };
};

export default authenticate;