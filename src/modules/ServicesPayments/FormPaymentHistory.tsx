import { PaymentStatus } from "@/generate/prisma/client";
import { Stack, Box, Text, Badge, HStack, Divider, Tag } from "@chakra-ui/react";

// Mapeo de estados a colores y etiquetas amigables
const statusConfig: Record<PaymentStatus, { color: string; label: string }> = {
    pending: { color: "gray", label: "Pendiente" },
    completed: { color: "green", label: "Completado" },
    dispute: { color: "orange", label: "En disputa" },
    refunded: { color: "purple", label: "Reembolsado" },
    failed: { color: "red", label: "Fallido" },
};

const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    } catch {
        return dateString;
    }
};

export const FormPaymentHistory = ({
    history,
}: {
    history: Array<{
        description: string;
        status: PaymentStatus;
        createdAt: string;
    }>;
}) => {
    if (!history.length) {
        return (
            <Stack spacing={3}>
                <Text color="gray.500" textAlign="center">
                    No hay pagos registrados
                </Text>
            </Stack>
        );
    }

    return (
        <Stack spacing={3} divider={<Divider />}>
            {history.map((payment, index) => {
                const config = statusConfig[payment.status];
                return (
                    <Box key={index} p={2}>
                        <HStack justify="space-between" wrap="wrap">
                            <Text fontWeight="medium" fontSize="md" maxW={'300px'}>
                                {payment.description}
                            </Text>
                            <Tag colorScheme={config.color} fontSize="xs" borderRadius="full">
                                {config.label}
                            </Tag>
                        </HStack>
                        <Text fontSize="sm" color="gray.500" mt={1}>
                            {formatDate(payment.createdAt)}
                        </Text>
                    </Box>
                );
            })}
        </Stack>
    );
};