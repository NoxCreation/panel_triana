import { IconButtonDeleteTable } from "@/components/IconButtonDeleteTable"
import { CustomColumnDef } from "@/types/CustomColumnDef"
import { CurrencyType } from "@/types/CurrencyType"
import { Box, Flex, IconButton } from "@chakra-ui/react"
import { CiEdit } from "react-icons/ci"
import { FiCreditCard, FiStar } from "react-icons/fi"

export const ColumnsTable = ({
    onDelete,
    onEdit
}: {
    onDelete: (row: CurrencyType) => void
    onEdit: (row: CurrencyType) => void
}): CustomColumnDef<CurrencyType>[] => {
    return (
        [
            {
                accessorKey: 'code',
                header: 'Codigo',
                enableSorting: true,
                /* sticky: 'left', */
                cell: ({ getValue, row }) => (
                    <Flex gap={2}>
                        {row.original.isLocal && <Box color={'primary.500'}><FiStar /></Box>}
                        {row.original.isCardOnly && <Box color={'teal.500'}> <FiCreditCard /></Box>}
                        {getValue<string>()}
                    </Flex>
                )
            },
            {
                accessorKey: 'name',
                header: 'Nombre',
                enableSorting: true,
            },
            {
                accessorKey: 'exchangeRateToUsd',
                header: 'Valor de Cambio',
                enableSorting: true,
                cell: ({ getValue, row }) => <>{getValue<string>()} {row.original.code} = 1 USD</>
            },
            {
                id: 'actions',
                cell: ({ row }) => (
                    <Flex gap={2} justifyContent={'end'}>
                        <IconButton
                            colorScheme="primary.500"
                            variant={'ghost'} size={'sm'} aria-label='Edit' icon={<CiEdit />} onClick={() => onEdit(row.original)} />
                        <IconButtonDeleteTable
                            onDelete={onDelete}
                            row={row.original}
                        />
                    </Flex>
                ),
            },
        ]
    )
}