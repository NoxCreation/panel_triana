import { PaymentStatus } from "@/generate/prisma/client";
import { CustomColumnDef } from "@/types/CustomColumnDef"
import { UserType } from "@/types/UserType"
import { Flex, IconButton, Stack, Switch, Tag, Tooltip, Text } from "@chakra-ui/react"
import { FiMenu } from "react-icons/fi"

const statusConfig: Record<PaymentStatus, { color: string; label: string }> = {
    pending: { color: "gray", label: "Pendiente" },
    completed: { color: "green", label: "Completado" },
    dispute: { color: "orange", label: "En disputa" },
    refunded: { color: "purple", label: "Reembolsado" },
    failed: { color: "red", label: "Fallido" },
};

export const ColumnsTable = ({
    onViewHistory,
    onChangeActive,
    onViewService
}: {
    onViewHistory: (row: any) => void
    onChangeActive: (row: any) => void
    onViewService: (row: any) => void
}): CustomColumnDef<UserType>[] => {
    return (
        [
            {
                accessorKey: 'active',
                header: 'Pago Activo',
                enableSorting: true,
                sticky: 'left',
                cell: ({ getValue, row }) => (
                    <Stack alignItems={'center'}>
                        <Switch colorScheme={getValue() ? "green" : "red"} isChecked={getValue<boolean>()} onChange={() => onChangeActive(row.original)} />
                    </Stack>
                )
            }, ,
            {
                accessorKey: 'createdAt',
                header: 'Fecha de Creación',
                enableSorting: true,
                sticky: 'left',
                cell: ({ getValue }) => (new Date(getValue() as string)).toLocaleString()
            },
            {
                accessorKey: 'lead.first_name',
                header: 'Nombre',
                enableSorting: true,
                sticky: 'left'
            },
            {
                accessorKey: 'lead.last_name',
                header: 'Apellido',
                enableSorting: true,
            },
            {
                accessorKey: 'service.title',
                header: 'Servicio',
                enableSorting: true,
                cell: ({ getValue, row }) => (
                    <Text
                        onClick={() => onViewService(row.original)}
                        cursor={'pointer'}
                        color={'primary.700'}
                        _hover={{
                            color: 'primary.500'
                        }}
                    >{getValue<string>()}</Text>
                )
            },
            {
                accessorKey: 'amount',
                header: 'Monto',
                enableSorting: true,
                /* sticky: 'left', */
            },
            {
                accessorKey: 'history',
                header: 'Estado Actual',
                enableSorting: true,
                cell: ({ getValue }) => {
                    const payment = getValue<Array<{ status: string }>>()
                    const config = statusConfig[payment[0]?.status];

                    return (
                        <Tag colorScheme={config.color} fontSize="xs" borderRadius="full">
                            {config.label}
                        </Tag>
                    )
                }
                /* sticky: 'left', */
            },
            {
                id: 'actions',
                sticky: 'right',
                cell: ({ row }) => (
                    <Flex gap={2} justifyContent={'end'}>
                        <Tooltip label="Ver Historial de Pagos">
                            <IconButton
                                colorScheme="primary.500"
                                variant={'ghost'} size={'sm'} aria-label='Edit' icon={<FiMenu />} onClick={() => onViewHistory(row.original)} />
                        </Tooltip>
                    </Flex>
                ),
            },
        ]
    )
}

