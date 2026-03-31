import LocalizedLink from "@/components/LocalizedLink";
import { useFetch } from "@/hooks/useFetch";
import { useGetProfile } from "@/hooks/useGetProfile";
import { Avatar, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Stack, Text } from "@chakra-ui/react"
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi"

export const ProfileButton = () => {
    const profile = useGetProfile()
    const route = useRouter()
    const [photo, setPhoto] = useState("")
    const { handleFetch } = useFetch()

    const handldeRefresh = async () => {
        if (profile)
            try {
                const response = await handleFetch(
                    `/users/${profile.id}`,
                    'GET'
                )
                if (response.status == 200) {
                    const data = (await response.json())
                    setPhoto(data.photo)
                }
            } catch { }
    }
    useEffect(() => { handldeRefresh() }, [profile?.first_name])

    const onSignOut = async () => {
        await signOut({ callbackUrl: "/auth", redirect: false });
        route.push("/auth")
    };

    return (
        <Menu >
            {({ isOpen }) => (
                <>
                    <MenuButton as={Button} rightIcon={<FiChevronDown style={{ rotate: isOpen ? "-180deg" : "0deg", transitionDuration: ".2s" }} />} variant={"ghost"} h={'50px'}>
                        <Flex gap={2} alignItems={'center'} color={'gray.500'}>
                            <Avatar w={'30px'} h={'30px'} name={`${profile?.first_name} ${profile?.last_name}`}
                                src={photo ? photo : '/avatar.svg'} >
                            </Avatar>
                            <Stack spacing={0} textAlign={'left'} justifyContent={'center'}>
                                <Text fontSize={'15px'} color={'gray.600'}>{profile?.first_name}</Text>
                                <Text fontSize={'10px'} color={'gray.600'}>{profile?.last_name}</Text>
                            </Stack>
                        </Flex>
                    </MenuButton>
                    <MenuList zIndex={1002}>
                        <LocalizedLink href={'/profile'}><MenuItem>Perfil</MenuItem></LocalizedLink>
                        <MenuItem onClick={onSignOut}>Salir</MenuItem>
                    </MenuList>
                </>
            )}
        </Menu>
    )
}