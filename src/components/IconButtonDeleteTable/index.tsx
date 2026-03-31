import { IconButton, Tooltip } from "@chakra-ui/react"
import { useState } from "react"
import { CiTrash } from "react-icons/ci"

export const IconButtonDeleteTable = ({
    onDelete,
    row
}: {
    onDelete: (data: any) => void
    row: any
}) => {
    const [loading, setLoading] = useState(false)

    return (
        <Tooltip label={"Eliminar"}>
            <IconButton
                isLoading={loading}
                colorScheme="red"
                variant={'ghost'} size={'sm'} aria-label='Remove' icon={<CiTrash />} onClick={async () => {
                    setLoading(true)
                    await onDelete(row)
                    setLoading(false)
                }}
            />
        </Tooltip>
    )
}