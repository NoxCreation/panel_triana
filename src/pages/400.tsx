import is_auth from "@/utils/middlewares/is_auth";
import { Center, Heading, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";

export default function Page400() {
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
            <Heading color={'primary.500'} fontSize={'100px'}>400</Heading>
            <Text fontSize={'18px'} color={'gray.700'}>Oops, an unexpected error has occurred.</Text>
        </Center>
    )
}
