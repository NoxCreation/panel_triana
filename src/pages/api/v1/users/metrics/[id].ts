import authenticate, { AuthenticatedRequest } from "@/middleware/auth";
import { prisma } from "@/utils/prisma";
import type { NextApiResponse } from "next";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    const user = req.user;

    // Proteger operaciones de escritura (solo ADMIN)
    if (req.method !== 'GET' && user?.role !== 'ADMIN') {
        return res.status(403).json({ error: "Acceso denegado. Se requieren permisos de administrador." });
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
        const {
            id
        } = req.query as {
            id: string
        }

        const user = await prisma.user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                photo: true,
                wallet: true
            }
        })

        const totalOrderPending = await prisma.order.count({ where: { createdBy: { id }, status: 'PENDING' } })
        const totalOrderPartial = await prisma.order.count({ where: { createdBy: { id }, status: 'PARTIALLY_PAID' } })
        const totalOrderPaid = await prisma.order.count({ where: { createdBy: { id }, status: 'PAID' } })

        const orders = await prisma.order.findMany({
            where: {
                NOT: {
                    status: "PAID"
                },
                createdById: id
            },
            include: {
                payments: {
                    include: {
                        distributions: {
                            include: {
                                currency: true
                            }
                        }
                    }
                }
            }
        })
        let payment_account = 0
        let amount_total = 0
        let amount_paid = 0
        orders.map(order => {
            amount_total += order.totalUsd.toNumber()
            order.payments.map((payment) => {
                const exchangeRates = payment.exchangeRates as {
                    [currencyCode: string]: number
                }
                payment.distributions.map(distribution => {
                    const rate = exchangeRates[distribution.currency.code]
                    amount_paid += distribution.amount.toNumber() / rate
                })
            })
        })
        payment_account = parseFloat((amount_total - amount_paid).toFixed(2))

        return res.status(200).json({
            wallet: user.wallet.toNumber(),
            totalOrderPending,
            totalOrderPartial,
            totalOrderPaid,
            payment_account
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener usuarios." });
    }
}


export default authenticate(handler);