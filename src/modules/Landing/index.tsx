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
    useToast,
    Flex,
    Button,
} from "@chakra-ui/react";
import { TabHome } from "./components/TabHome";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { Preview } from "./components/Preview";
import { ContentType } from "@/types/ContentType";
import { TabServices } from "./components/TabServices";
import { TabMy } from "./components/TabMy";
import { TabTestimonies } from "./components/TabTestimonies";
import { TabContact } from "./components/TabContact";
import { FiSave } from "react-icons/fi";

export default function LandingIndex() {
    const toast = useToast()
    const [tab, setTab] = useState(0)
    const { handleFetch, isLoading } = useFetch()
    const [content, setContent] = useState({
        home: {
            main_title: "",
            main_subtitle: "",
            main_label: "",
            btn_cta_to_schedule: "",
            btn_cta_my_work: "",
            stats: {
                driven_businesses: 0,
                years_of_experience: 0,
                satisfied_customers: 0
            },
            why_choose_me: [
            ],
            how_we_work: [
            ]
        },
        services: {
            main_title: "",
            main_subtitle: "",
            services: []
        },
        testimonies: {
            main_title: "",
            main_subtitle: "",
            testimonies: []
        },
        contact: {
            main_title: "",
            main_subtitle: "",
            contact: {
                address: "",
                phone: "",
                email: "",
                hours: ""
            },
            social: {
                linkedln: "",
                tiktok: "",
                facebook: "",
                instagram: "",
                youtube: ""
            }
        },
    } as ContentType)

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
        if (response.status == 201) {
            toast({
                title: "Contenido guardado",
                status: "success",
                position: "top-right",
                duration: 3000,
                isClosable: true,
                variant: "subtle"
            })
        }
        else {
            toast({
                title: "Error al guardar el contenido",
                status: "error",
                position: "top-right",
                duration: 3000,
                isClosable: true,
                variant: "subtle"
            })
        }
    }

    const getPath = () => {
        switch (tab) {
            case 0:
                return '/'
            case 1:
                return '/service'
            case 2:
                return '/my'
            case 3:
                return '/testimonies'
            case 4:
                return '/contact'
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
                                    <Flex gap={4}>
                                        <TabList flex={1}>
                                            <Tab>Principal</Tab>
                                            <Tab>Servicios</Tab>
                                            <Tab>Sobre Mi</Tab>
                                            <Tab>Testimonios</Tab>
                                            <Tab>Contacto</Tab>
                                        </TabList>
                                        <Button variant={'ghost'} isDisabled={isLoading} gap={2} onClick={async () => {
                                            await handleSaveContent()
                                        }}>
                                            <FiSave /> Guardar
                                        </Button>
                                    </Flex>

                                    <TabPanels>
                                        {/* Home */}
                                        <TabHome
                                            content={content}
                                            onChangeContent={handleChangeContent}
                                            onSaveContent={handleSaveContent}
                                            isLoading={isLoading}
                                        />

                                        {/* Services */}
                                        <TabServices
                                            content={content}
                                            onChangeContent={handleChangeContent}
                                            onSaveContent={handleSaveContent}
                                            isLoading={isLoading}
                                        />

                                        {/* My */}
                                        <TabMy
                                            content={content}
                                            onChangeContent={handleChangeContent}
                                            onSaveContent={handleSaveContent}
                                            isLoading={isLoading}
                                        />

                                        {/* Testimonies */}
                                        <TabTestimonies
                                            content={content}
                                            onChangeContent={handleChangeContent}
                                            onSaveContent={handleSaveContent}
                                            isLoading={isLoading}
                                        />

                                        {/* Contact */}
                                        <TabContact
                                            content={content}
                                            onChangeContent={handleChangeContent}
                                            onSaveContent={handleSaveContent}
                                            isLoading={isLoading}
                                        />
                                    </TabPanels>
                                </Tabs>
                            </Stack>

                            {/* Columna derecha: vista previa */}
                            {/* <Preview path={getPath()} /> */}
                        </SimpleGrid>
                    </CardBody>
                </Card>
            </Stack>
        </ContainerSystem>
    );
}