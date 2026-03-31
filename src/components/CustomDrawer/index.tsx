import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerProps } from "@chakra-ui/react"
import { ReactNode } from "react"

type Props = {
    children: ReactNode
    footer?: ReactNode
    title?: string
    isOpen: boolean
    minW?: string
    onClose: () => void
} & DrawerProps

export const CustomDrawer = ({
    children,
    footer,
    title,
    isOpen,
    minW,
    onClose,
    ...props
}: Props) => {
    return (
        <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            {...props}
        >
            <DrawerOverlay />
            <DrawerContent m={{ base: 0, md: 4 }} borderRadius={'4px'} minW={minW} >
                <DrawerCloseButton />
                <DrawerHeader>{title}</DrawerHeader>

                <DrawerBody >
                    {children}
                </DrawerBody>

                <DrawerFooter>
                    {footer && footer}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}