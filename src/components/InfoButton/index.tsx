import { IconButton, Tooltip } from "@chakra-ui/react"
import { FiInfo } from "react-icons/fi"

export const InfoButton = ({
    label,
    onClick
}: {
    label: string
    onClick?: () => void
}) => {
    return (
        <Tooltip label={label}>
            <IconButton
                size={'sm'}
                variant={'ghost'}
                aria-label=""
                icon={<FiInfo />}
                onClick={onClick}
            />
        </Tooltip>
    )
}