import { ContainerSystem } from "@/components/ContainerSystem";
import TextEditor from "@/components/TextEditor";
import { useFetch } from "@/hooks/useFetch";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Stack,
    Button,
    useToast,
    Box,
    Progress,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

// Definimos la estructura de la respuesta (ajústala según tu API)
interface PrivacyPolicyResponse {
    id: string;
    content: string;
    updatedAt: string;
}

export default function PrivacyPolicyWebIndex() {
    const [body, setBody] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const toast = useToast();
    const { handleFetch, isLoading } = useFetch()

    // Cargar la política existente al montar el componente
    useEffect(() => {
        const fetchPolicy = async () => {
            setLoading(true);
            try {
                const response = await handleFetch("/privacy-policy-web", 'GET');
                if (response.status == 200) {
                    const json = await response.json()
                    setBody(json.content || "");
                }
                else {
                    toast({
                        title: "Error",
                        description: "No se pudo cargar la política de privacidad.",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                    });
                }
            } catch (error) {
                console.error(error);
                toast({
                    title: "Error",
                    description: "No se pudo cargar la política de privacidad.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPolicy();
    }, [toast]);

    // Guardar la política
    const handleSave = async () => {
        try {
            const response = await handleFetch("/privacy-policy-web", 'PUT', {
                content: body
            });
            if (response.status == 200) {
                toast({
                    title: "Guardado",
                    description: "La política de privacidad se actualizó correctamente.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            }
            else {
                toast({
                    title: "Error",
                    description: "No se pudo guardar la política.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "No se pudo guardar la política.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <ContainerSystem
            navBarControl={
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="#">Políticas de Privacidad</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href="/privacy-policy-web">Listar</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            }
        >
            <Stack spacing={4}>

                {isLoading && <Progress isIndeterminate colorScheme="primary" />}
                <TextEditor
                    body={body}
                    setBody={setBody}
                    loading={loading}
                />
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        onClick={handleSave}
                        isLoading={isLoading}
                        loadingText="Guardando..."
                    >
                        Guardar cambios
                    </Button>
                </Box>
            </Stack>
        </ContainerSystem>
    );
}