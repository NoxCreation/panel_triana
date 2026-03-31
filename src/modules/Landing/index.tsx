import { ContainerSystem } from "@/components/ContainerSystem";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Card,
    CardBody,
    CardHeader,
    Heading,
    Stack,
    SimpleGrid,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    Progress,
} from "@chakra-ui/react";
import { TabHome } from "./components/TabHome";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { Preview } from "./components/Preview";

export default function LandingIndex() {
    const [tab, setTab] = useState(0)
    const { handleFetch, isLoading } = useFetch()
    const [content, setContent] = useState({
        home: {
            main_title: "",
            main_subtitle: ""
        }
    } as {
        [key: string]: any
    })

    const handleChangeContent = (key: string, new_content: { [key: string]: any }) => {
        setContent(
            {
                ...content,
                [key]: {
                    ...content[key],
                    ...new_content
                }
            }
        )
    }

    const handlGetContent = async () => {
        const response = await handleFetch("/landing", 'GET')
        if (response.status == 200) {
            const data = await response.json()
            return data.content
        }
        return undefined
    }

    const handleSaveContent = async () => {
        const response = await handleFetch("/landing", 'POST', { content })
        if (response.status == 200) {

        }
    }

    const getPath=()=>{
        switch(tab){
            case 0:
                return '/'
            case 1:
                return '/service'
        }
         return '/'
    }

    useEffect(() => {
        const load = async () => {
            const content = await handlGetContent()
            if (content)
                setContent(content)
        }
        load()
    }, [])

    return (
        <ContainerSystem
            navBarControl={
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>Landing</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href='/landing'>Editar contenido</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            }
        >
            <Stack spacing={6}>
                <Card>
                    <CardHeader>
                        <Heading size='md'>Editar contenido de la Landing Page</Heading>
                    </CardHeader>
                    <CardBody>
                        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                            {/* Columna izquierda: formularios por sección */}
                            <Stack>
                                {isLoading && <Progress isIndeterminate colorScheme="primary" size={'sm'} />}
                                <Tabs variant="enclosed" colorScheme="primary" onChange={e => setTab(e)}>
                                    <TabList>
                                        <Tab>Principal</Tab>
                                        <Tab>Servicios</Tab>

                                    </TabList>

                                    <TabPanels>
                                        {/* Home */}
                                        <TabHome
                                            content={content}
                                            onChangeContent={handleChangeContent}
                                            onSaveContent={handleSaveContent}
                                            isLoading={isLoading}
                                        />
                                    </TabPanels>
                                </Tabs>
                            </Stack>

                            {/* Columna derecha: vista previa */}
                            <Preview path={getPath()} />
                        </SimpleGrid>
                    </CardBody>
                </Card>
            </Stack>
        </ContainerSystem>
    );
}