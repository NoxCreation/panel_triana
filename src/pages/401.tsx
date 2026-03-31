import is_auth from "@/utils/middlewares/is_auth";
import { Button, Center, Heading, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

export default function Page400() {
    const route = useRouter()
    return (
        <Center
            minHeight={"100vh"}
            width={"full"}
            backgroundColor={"transparent !important"}
            borderRadius={"lg"}
            display={'flex'}
            flexDir={'column'}
            gap={5}
        >
            <Heading color={'primary.500'} fontSize={'100px'}>401</Heading>
            <Text fontSize={'18px'} color={'gray.700'}>Oops, you do not have permission to enter here.</Text>
            <Button w={'200px'} onClick={() => route.push("/auth")}>Authenticate</Button>
        </Center>
    )
}

