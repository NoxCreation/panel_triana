import {
    Flex,
    Stack,
    Button,
    Image,
    Heading,
    VStack,
    useToast,
    Box,
    Text,
    Link
} from "@chakra-ui/react";
import Particles from "@/components/Particles";
import { Transition } from "@/components/Transition";
import { useForm } from "react-hook-form";
import { Form } from "@/components/Form";
import { InputVP } from "@/components/InputVP";
import { InputPasswordVP } from "@/components/InputPasswordVP";
import { useState } from "react";
import { signIn } from 'next-auth/react';
import { useRouter } from "next/router";

export default function LoginSplit() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();
    const { handleSubmit, control, setValue } = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const handleLogin = async (data) => {
        setLoading(true);
        await signIn('credentials', {
            ...data,
            redirect: false,
        }).then((e: any) => {
            if (e.ok) {
                toast({
                    description: "Usuario autenticado satisfactoriamente",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                    variant: "subtle",
                    position: "top-right"
                });
                router.push("/home", undefined, { locale: router.locale });
            } else {
                toast({
                    title: "Error",
                    description: "Las credenciales no son válidas",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    variant: "subtle",
                    position: "top-right"
                });
            }
            setLoading(false);
        });
    };

    return (
        <Stack bg={"#F7FAFC"} h={'100vh'} direction="row" spacing={0} id="jjj">
            {/* Partículas de fondo (cubren toda la pantalla) */}
            <Stack
                position={'fixed'}
                left={0}
                top={0}
                w={'100vw'}
                h={'100vh'}
                zIndex={0}
            >
                <Particles
                    particleColors={['#e879f9', '#a21caf']}
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover={false}
                    alphaParticles={false}
                    disableRotation={false}
                    className={'particles-container'}
                />
            </Stack>

            {/* Lado izquierdo: formulario */}
            <Flex
                flex={1}
                align="center"
                justify="center"
                position="relative"
                zIndex={1}
                bg="rgba(255,255,255,0.85)"
                backdropFilter="blur(8px)"
                p={{ base: 0, md: 8 }}
            >
                <Transition type="bootom" velocity="slow">
                    <VStack spacing={6} w={{ base: "xs", md: "md" }} align="stretch">
                        <Stack>
                            <Heading size="lg" color="gray.800" fontWeight="semibold" textAlign="center">
                                Bienvenido
                            </Heading>
                            <Text color="gray.600" textAlign="center" fontSize="sm">
                                Ingresa tus credenciales para acceder
                            </Text>
                        </Stack>

                        <Form onSubmit={handleSubmit(handleLogin)}>
                            <InputVP
                                name="email"
                                label="Correo electrónico"
                                type="email"
                                control={control}
                                rules={{
                                    required: "Campo requerido",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Correo inválido"
                                    }
                                }}
                                placeholder="tu@empresa.com"
                                onChange={e => setValue("email", e.target.value)}
                            />

                            <InputPasswordVP
                                name="password"
                                label="Contraseña"
                                control={control}
                                rules={{ required: "Campo requerido" }}
                                placeholder="••••••••"
                                onChange={e => setValue("password", e.target.value)}
                            />

                            <Button
                                colorScheme="primary"
                                size="lg"
                                borderRadius="full"
                                mt={2}
                                bgGradient="linear(to-r, primary.400, primary.500)"
                                _hover={{ bgGradient: "linear(to-r, primary.600, primary.600)" }}
                                _active={{ bgGradient: "linear(to-r, primary.700, primary.700)" }}
                                type="submit"
                                w="full"
                                isLoading={loading}
                            >
                                Ingresar
                            </Button>
                        </Form>

                        {/* Copyright discreto */}
                        <Text fontSize="xs" color="gray.400" textAlign="center" pt={2}>
                            © Triana & Marketing | Desarrollado por{" "}
                            <Link href="https://noxcreation.dev" isExternal color="pink.600" _hover={{ color: "orange.500" }}>
                                NOX Creation
                            </Link>
                        </Text>
                    </VStack>
                </Transition>
            </Flex>

            {/* Lado derecho: imagen */}
            <Box
                flex={1}
                position="relative"
                display={{ base: "none", md: "block" }}
                zIndex={1}
                overflow="hidden"
            >
                <Image
                    src="/banner.jpg"
                    alt="Ilustración de trabajo colaborativo"
                    objectFit="cover"
                    w="full"
                    h="full"
                />
                <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    p={6}
                    bgGradient="linear(to-t, rgba(0,0,0,0.6), transparent)"
                    color="white"
                >
                    <Heading size="md" fontWeight="bold">
                        Gestión eficiente
                    </Heading>
                    <Text fontSize="sm">
                        Accede a todas las herramientas de administración
                    </Text>
                </Box>
            </Box>
        </Stack>
    );
}