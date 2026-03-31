import { IconButton, Tooltip, ButtonProps } from "@chakra-ui/react"

type Props = {
    label: string
    icon: any
    colorScheme?: string
    onClick?: () => void
} & ButtonProps

export const BtnOption = ({
    label,
    icon,
    colorScheme,
    onClick,
    ...props
}: Props) => {
    return (
        <Tooltip label={label}>
            <IconButton {...props} colorScheme={colorScheme} aria-label={label} icon={icon} onClick={onClick} />
        </Tooltip>
    )
}