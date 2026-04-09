import { ContainerSystem } from "@/components/ContainerSystem";
import { ImageUploadEdit } from "@/components/ImageUploadEdit";
import { InputVP } from "@/components/InputVP";
import { TextareaVP } from "@/components/TextareaVP";
import TextEditor from "@/components/TextEditor";
import { useGetProfile } from "@/hooks/useGetProfile";
import { ArticleType } from "@/types/ArticleType";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Card,
    CardBody,
    Container,
    Flex,
    Stack,
    useToast,
    Text,
    Button,
    SimpleGrid
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ArticleCreateIndex({
    article
}: {
    article?: ArticleType
}) {
    const router = useRouter()
    const toast = useToast()
    const profile = useGetProfile()

    const [loading, setLoading] = useState(false)
    const { control, handleSubmit, watch, setValue } = useForm({
        defaultValues: article ? article : {
            id: undefined,
            title: "",
            mini_description: "",
            thumbnail: "",
            description: ""
        }
    })

    const handleSave = async (data) => {
        setLoading(true)
        if (!article) {
            const requestOptions = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "authorization": `Bearer ${profile.accessToken}`
                }
            } as any
            const response = await fetch("/api/v1/blog/", requestOptions)
            if (response.status == 200) {
                toast({
                    title: "Artículo guardado",
                    variant: "subtle",
                    status: "success",
                    position: "top-right"
                })
                router.push("/blog")
            }
            else
                toast({
                    title: "Error guardando artículo",
                    variant: "subtle",
                    status: "error",
                    position: "top-right"
                })
        }
        else {
            const requestOptions = {
                method: 'PUT',
                body: JSON.stringify(data),
                headers: {
                    "authorization": `Bearer ${profile.accessToken}`
                }
            } as any
            const response = await fetch("/api/v1/blog/", requestOptions)
            if (response.status == 200) {
                toast({
                    title: "Artículo guardado",
                    variant: "subtle",
                    status: "success",
                    position: "top-right"
                })
            }
            else
                toast({
                    title: "Error guardando artículo",
                    variant: "subtle",
                    status: "error",
                    position: "top-right"
                })
        }
        setLoading(false)
    }

    return (
        <ContainerSystem navBarControl={
            <Breadcrumb>
                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => router.push('/blog')}>Blog</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem>
                    <BreadcrumbLink onClick={() => router.push('/blog')}>Listar</BreadcrumbLink>
                </BreadcrumbItem>

                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink href='#'>{article ? "Editar" : "Crear"} Artículo</BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        }>
            <Container maxW={'6xl'}>
                <Stack gap={2} as={'form'} onSubmit={handleSubmit(handleSave)}>
                    <Card>
                        <CardBody>
                            <Flex alignItems={'center'}>
                                <Stack flex={1}>
                                    <Text color={'gray.500'} fontSize={'12px'}>{article ? "Editar" : "Crear"} Artículo</Text>
                                </Stack>
                                <Flex gap={2}>
                                    <Button type="submit" isLoading={loading}>Guardar Artículo</Button>
                                </Flex>
                            </Flex>
                        </CardBody>
                    </Card>

                    <SimpleGrid columns={2} gap={2}>

                        <Card>
                            <CardBody>

                                <Stack>
                                    <ImageUploadEdit
                                        w={500}
                                        h={300}
                                        width={500}
                                        height={300}
                                        image={watch("thumbnail")}
                                        onChangeImage={(thumbnail) => {
                                            setValue('thumbnail', thumbnail)
                                        }}
                                    />

                                    <InputVP
                                        control={control}
                                        label="Título"
                                        name="title"
                                        rules={{
                                            required: "Este campo es requerido"
                                        }}
                                        type="text"
                                        onChange={e => {
                                            setValue("title", e.target.value)
                                        }}
                                    />

                                    <TextareaVP
                                        control={control}
                                        value={watch("mini_description")}
                                        label="Descripción"
                                        name="mini_description"
                                        rules={{
                                            required: "Este campo es requerido"
                                        }}
                                        onChange={e => {
                                            setValue("mini_description", e.target.value)
                                        }}
                                        maxLength={250}
                                    />
                                </Stack>

                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <Stack alignItems={'center'}>
                                    <TextEditor
                                        body={watch("description")}
                                        setBody={(html) => {
                                            setValue("description", html)
                                        }}
                                        loading={false}
                                    />
                                </Stack>
                            </CardBody>
                        </Card>

                    </SimpleGrid>
                </Stack>
            </Container>

        </ContainerSystem>
    )
}