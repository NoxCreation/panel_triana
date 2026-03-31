import localFont from "next/font/local";
import Head from "next/head";
import { ReactNode } from "react";
import { Footer } from "./Footer";
import { Flex, Stack, useColorMode } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import useVoypatiContext from "@/hooks/useVoypatiContext";

type Props = {
    children: ReactNode | ReactNode[];
    screenTitle?: string;
};

const poppinsBlack = localFont({
    src: "../theme/fonts/Poppins-Black.woff",
    variable: "--font-poppins-black",
    weight: "900",
});
const poppinsRegular = localFont({
    src: "../theme/fonts/Poppins-Regular.woff",
    variable: "--font-poppins-regular",
    weight: "100",
});
const poppinsBlackItalic = localFont({
    src: "../theme/fonts/Poppins-BlackItalic.woff",
    variable: "--font-poppins-blackitalic",
    weight: "900",
});

export default function MainLayout({ children, screenTitle = "VoyPati" }: Props) {
    const { collapseMenu } = useVoypatiContext()
    const { colorMode } = useColorMode()

    return (
        <Flex flexDir={'column'} bg={colorMode == 'light' ? "gray.50" : 'gray.800'}>
            <Head>
                <title>{screenTitle}</title>
                <meta name="description" content="" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <div className={`
                ${poppinsRegular.variable} 
                ${poppinsBlack.variable}
                ${poppinsBlackItalic.variable}
            `}>
                <Flex w={'100vw'} overflow={'visible'}>
                    <Sidebar />
                    <Stack transition={'all 1s'} w={'100%'} pl={{ base: 0, md: collapseMenu ? '80px' : '255px' }} pt={{ base: 20, md: 0 }} overflow={'visible'}>
                        <main>
                            {children}
                        </main>
                        <footer>
                            <Footer />
                        </footer>
                    </Stack>
                </Flex>
            </div>
        </Flex>
    )
}