import { CountryFlag } from "@/components/CountryFlag"
import { IconButtonDeleteTable } from "@/components/IconButtonDeleteTable"
import { CustomColumnDef } from "@/types/CustomColumnDef"
import { UserType } from "@/types/UserType"
import { Flex } from "@chakra-ui/react"

export const ColumnsTable = ({
    onDelete,
}: {
    onDelete: (row: UserType) => void
}): CustomColumnDef<UserType>[] => {
    return (
        [
            {
                accessorKey: 'first_name',
                header: 'Nombre',
                enableSorting: true,
                sticky: 'left'
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
                accessorKey: 'phone',
                header: 'Teléfono',
                enableSorting: true,
                /* sticky: 'left', */
            },
            {
                accessorKey: 'country_code',
                header: 'Código de País',
                enableSorting: true,
                /* sticky: 'left', */
                cell: ({ getValue }) => (
                    <CountryFlag countryCode={getValue<string>().toLowerCase()} />
                )
            },
            {
                accessorKey: '_count.payments',
                header: 'Cantidad de Pagos',
                enableSorting: true
            },
            {
                id: 'actions',
                sticky: 'right',
                cell: ({ row }) => (
                    <Flex gap={2} justifyContent={'end'}>
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

