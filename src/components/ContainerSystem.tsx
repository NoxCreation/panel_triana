import { Stack, BoxProps } from "@chakra-ui/react"
import { ReactNode } from "react"
import { Navbar } from "./Layout/Navbar"
import { Transition } from "./Transition"

type Props = {
    navBarControl?: ReactNode,
    children: ReactNode
    showPaddings?: boolean
} & BoxProps

export const ContainerSystem = ({
    navBarControl,
    children,
    showPaddings = true,
    ...props
}: Props) => {
    return (
        <Stack {...props} zIndex={5} w={'100vw'} gap={0}>
            <Transition type="top" velocity="fast" >
                <Navbar
                    navBarControl={navBarControl}
                />
            </Transition>
            <Transition type="bootom" velocity="fast" >
                <Stack mt={0} minH={"calc(100vh - 80px)"} px={{ base: "16px", md: showPaddings ? "16px" : "0" }} pr={{ base: "16px", md: "110px" }} spacing={4}>
                    {children}
                </Stack>
            </Transition>
        </Stack>
    )
}