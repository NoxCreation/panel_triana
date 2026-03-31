import {
    Stack,
    Heading,
    Box,
    Image,
    Text,
    Button,
    Progress,
    useToast,
    Flex,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";

export const Preview = ({ path }: { path: string }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchScreenshot = async (forceRefresh: boolean = false) => {
        if (!path) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        setIsLoading(true);
        try {
            const url = `/api/v1/landing/screenshot?path=${encodeURIComponent(path)}${forceRefresh ? "&force_refresh=true" : ""}`;
            const response = await fetch(url, { signal: abortController.signal });
            if (!response.ok) {
                throw new Error("Error al obtener la vista previa");
            }
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            setImageUrl(blobUrl);
            setIsLoading(false);
        } catch (error: any) {
            if (error.name === "AbortError") return;
            console.error("Error fetching screenshot:", error);
            toast({
                title: "Error al cargar vista previa",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScreenshot(false);
        return () => {
            if (imageUrl) URL.revokeObjectURL(imageUrl);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [path]);

    const handleRefresh = () => fetchScreenshot(true);

    return (
        <Stack spacing={3}>
            <Flex>
                <Heading size="sm" flex={1}>Vista previa {path}</Heading>
                <Button
                    size="sm"
                    onClick={handleRefresh}
                    isLoading={isLoading}
                    loadingText="Refrescando..."
                    colorScheme="primary"
                    variant="outline"
                    alignSelf="flex-start"
                >
                    Refrescar vista previa
                </Button>
            </Flex>
            <Box
                borderWidth="1px"
                borderRadius="lg"
                overflowY="scroll"
                bg="white"
                minH="400px"
                position="relative"
                maxH="500px"
            >
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="Vista previa de la landing page"
                        objectFit="contain"
                        width="100%"
                    />
                ) : (
                    <Stack h={'100%'} justifyContent={'center'}>
                        <Text color="gray.500" w="100%" textAlign={'center'}>Cargando vista previa</Text>
                    </Stack>
                )}
            </Box>
        </Stack>
    );
};