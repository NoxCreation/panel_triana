import { format } from "date-fns";
import { prisma } from "@/utils/prisma";

// Función auxiliar para generar número de orden único
export async function generateOrderNumber(): Promise<string> {
    const today = new Date();
    const dateStr = format(today, 'ddMMyyyy'); // ej: 21022025

    // Intentar hasta encontrar un número no utilizado
    let attempt = 0;
    const maxAttempts = 100; // evitar bucle infinito

    while (attempt < maxAttempts) {
        // Obtener el último número de orden del día
        const lastOrder = await prisma.order.findFirst({
            where: { orderNumber: { startsWith: `O-${dateStr}-` } },
            orderBy: { orderNumber: 'desc' },
        });

        let nextNumber = 1;
        if (lastOrder) {
            const lastSeq = parseInt(lastOrder.orderNumber.slice(-5));
            nextNumber = lastSeq + 1;
        }

        const candidate = `O-${dateStr}-${nextNumber.toString().padStart(5, '0')}`;

        // Intentar crear con ese número (en una transacción separada, pero aquí solo verificamos)
        // En realidad, la creación se hará en la transacción principal, pero podemos verificar si existe para evitar conflictos.
        // Como puede haber concurrencia, lo manejaremos con try-catch en la transacción principal.
        // Pero para simplificar, aquí devolvemos el candidato y confiamos en que la transacción falle si ya existe.
        // Una mejor práctica es dejar que la BD rechace el duplicado y reintentar.
        // Por eso, en lugar de hacer esta verificación, podemos generar el número y si falla, reintentar.
        // Pero como la transacción principal ya es grande, podríamos separar la generación en una función que reintente.

        // Por ahora, simplemente devolvemos el candidato y en la transacción principal si falla por unique, capturamos y reintentamos.
        return candidate;
    }

    throw new Error("No se pudo generar un número de orden único después de varios intentos.");
}