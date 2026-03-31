import { ModalProps, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, ModalFooter } from "@chakra-ui/react"
import { ReactNode } from "react"

type Props = {
    children: ReactNode
    footer?: ReactNode
    title?: string
    isOpen: boolean
    onClose: () => void
} & ModalProps

export const CustomModal = ({
    children,
    footer,
    title,
    isOpen,
    onClose,
    ...props
}: Props) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} {...props} isCentered closeOnOverlayClick={false} closeOnEsc={false}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {children}
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    )
}