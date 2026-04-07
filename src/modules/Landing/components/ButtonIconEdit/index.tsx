import { Flex, Icon, IconButton } from "@chakra-ui/react"
import * as FeatherIcons from "react-icons/fi";

export const ButtonIconEdit = ({
    icon,
    onOpen,
    onDeleteWhyChooseMe
}: {
    icon?: string;
    onOpen: () => void;
    onDeleteWhyChooseMe: () => void;
}) => {
    const IconComponent = icon && FeatherIcons[icon as keyof typeof FeatherIcons];

    return (
        <Flex gap={2} alignItems={'center'} justifyContent={'center'}>
            <Icon
                as={IconComponent}
                boxSize={10}
                color="primary.700"
                mb={2}
            />
            <IconButton
                size={'xs'} colorScheme="green" variant={'ghost'}
                aria-label="replace" icon={<FeatherIcons.FiEdit />} onClick={onOpen} />
            <IconButton
                size={'xs'} colorScheme="red" variant={'ghost'}
                aria-label="replace" icon={<FeatherIcons.FiTrash2 />} onClick={onDeleteWhyChooseMe} />
        </Flex>
    )
}