import { IconButtonDeleteTable } from "@/components/IconButtonDeleteTable"
import { useGetProfile } from "@/hooks/useGetProfile"
import { CustomColumnDef } from "@/types/CustomColumnDef"
import { OrderType } from "@/types/OrderType"
import { UserType } from "@/types/UserType"
import { Badge, Flex, IconButton, Image, Tag, Text, Tooltip } from "@chakra-ui/react"
import { CiEdit, CiViewList } from "react-icons/ci"

export const ColumnsTable = ({
    onDelete,
    onEdit,
    onViewDetail
}: {
    onDelete: (row: UserType) => void
    onEdit: (row: UserType) => void
    onViewDetail: (row: UserType) => void
}): CustomColumnDef<UserType>[] => {
    return (
        [
            {
                accessorKey: 'first_name',
                header: 'Nombre',
                enableSorting: true,
                sticky: 'left',
                cell: ({ getValue, row }) => (
                    <Flex alignItems={'center'} gap={2} flexDir={{ base: 'column', md: 'row' }}>
                        <Image borderRadius={'full'} src={row.original.photo} w={'35px'}
                            fallbackSrc="/unknown_image.jpg"
                        />
                        <Text>{getValue<string>()}</Text>
                    </Flex>
                )
            },
            {
                accessorKey: 'last_name',
                header: 'Apellido',
                enableSorting: true,
            },
            {
                accessorKey: 'email',
                header: 'Correo',
                enableSorting: true,
                /* sticky: 'left', */
            },
            {
                id: 'actions',
                cell: ({ row }) => (
                    <Flex gap={2} justifyContent={'end'}>
                        <Tooltip label="Editar">
                            <IconButton
                                colorScheme="primary.500"
                                variant={'ghost'} size={'sm'} aria-label='Edit' icon={<CiEdit />} onClick={() => onEdit(row.original)} />
                        </Tooltip>
                        <IconButtonDeleteTable
                            onDelete={onDelete}
                            row={row.original}
                        />
                        <Tooltip label="Detalles">
                            <IconButton
                                colorScheme="teal.500"
                                variant={'ghost'} size={'sm'} aria-label='Details' icon={<CiViewList />} onClick={() => onViewDetail(row.original)} />
                        </Tooltip>
                    </Flex>
                ),
            },
        ]
    )
}

export const ColumnsTableOrders = ({
    onRefresh
}: {
    onRefresh: () => void
}): CustomColumnDef<OrderType>[] => {
    const profile = useGetProfile()
    const role = profile ? profile.role : 'ADMIN'
    return (
        [
            {
                accessorKey: 'orderNumber',
                header: 'Number',
                enableSorting: true,
            },
            {
                accessorKey: 'date',
                header: 'Creada',
                enableSorting: true,
                cell: ({ getValue }) => <>{(new Date(getValue<string>())).toLocaleString()}</>
            },
            {
                accessorKey: 'status',
                header: 'Status',
                enableSorting: true,
                cell: ({ getValue }) => {
                    const status = getValue<"PAID" | "PENDING" | "PARTIALLY_PAID">()
                    if (status == 'PAID')
                        return <Tag colorScheme={'green'}>pagado</Tag>
                    else if (status == 'PARTIALLY_PAID')
                        return <Tag colorScheme={'orange'}>deuda</Tag>
                    else if (status == 'PENDING')
                        return <Tag colorScheme={'gray'}>sin pagar</Tag>
                    else
                        return <>-</>
                }
            },
            {
                accessorKey: 'totalUsd',
                header: 'Precio',
                enableSorting: true,
            },
            {
                accessorKey: 'warehouse.name',
                header: 'Almacen',
                enableSorting: false,
            },
            {
                accessorKey: '_count.items',
                header: '# Articulos',
                enableSorting: false,
            },
            {
                accessorKey: '_count.payments',
                header: '',
                enableSorting: false,
                cell: ({ row }) => (
                    <Flex gap={2} alignItems={'center'}>
                        {(row.original.status != "PAID" && role == 'ADMIN') && <ButtonPay orderId={row.original.id} onRefresh={onRefresh} />}
                    </Flex>
                )
            },
        ]
    )
}