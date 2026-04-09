import { IconButtonDeleteTable } from "@/components/IconButtonDeleteTable"
import { CustomColumnDef } from "@/types/CustomColumnDef"
import { UserType } from "@/types/UserType"
import { Flex, IconButton, Image, Tag, Text, Tooltip } from "@chakra-ui/react"
import { CiEdit } from "react-icons/ci"

export const ColumnsTable = ({
    onDelete,
    onEdit
}: {
    onDelete: (row: UserType) => void
    onEdit: (row: UserType) => void
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
                    </Flex>
                ),
            },
        ]
    )
}

