import {
    Flex,
} from "@chakra-ui/react"
import { ProfileButton } from "./ProfileButton"
import { ReactNode } from "react"

export const Navbar = ({ navBarControl }: { navBarControl: ReactNode }) => {/*  */

    return (
        <Flex px={{ base: "16px", md: "16px" }} pr={{ base: "16px", md: "110px" }} my={4} gap={4} h={"50px"} alignItems={'center'}>
            <Flex flex={1} zIndex={5}>
                {navBarControl}
            </Flex>
            <Flex display={{ base: "none", md: 'flex' }} alignItems={'center'} flexGrow={0} flexShrink={0} zIndex={5}>
                <ProfileButton />
            </Flex>
        </Flex>
    )
}