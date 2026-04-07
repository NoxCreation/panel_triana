import { Flex, IconButton, Text, Divider } from "@chakra-ui/react"
import { FiPlus } from "react-icons/fi"

export const HeadingTitle = ({
    title,
    onClick
}: {
    title: string
    onClick?: () => void
}) => (
    <Flex alignItems={'center'} gap={2}>
        <Text flex={1} whiteSpace={'nowrap'} fontWeight={700} color={'primary.600'}>{title}</Text>
        <Divider />
        {onClick && <IconButton size={'xs'} aria-label="add" icon={<FiPlus />}
            onClick={onClick}
        />}
    </Flex>
)