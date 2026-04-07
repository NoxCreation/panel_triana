import { IconButtonDeleteTable } from "@/components/IconButtonDeleteTable"
import { ArticleType } from "@/types/ArticleType"
import { CustomColumnDef } from "@/types/CustomColumnDef"
import { Flex, IconButton, Tooltip } from "@chakra-ui/react"
import { CiEdit } from "react-icons/ci"

export const ColumnsTable = ({
    onDelete,
    onEdit
}: {
    onDelete: (row: ArticleType) => void
    onEdit: (row: ArticleType) => void
}): CustomColumnDef<ArticleType>[] => {
    return (
        [
            {
                accessorKey: 'title',
                header: 'Nombre',
                enableSorting: true,
                sticky: 'left'
            },
            {
                accessorKey: 'mini_description',
                header: 'Mini Descripcion',
                enableSorting: true,
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

