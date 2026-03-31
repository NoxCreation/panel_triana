import {
    Card,
    CardBody,
    Container,
    Flex,
    Stack,
    Button,
    Image,
    Heading,
    VStack,
    Divider,
    useToast,
} from "@chakra-ui/react";
import Particles from "@/components/Particles";
import { Transition } from "@/components/Transition";
import { useForm } from "react-hook-form";
import { useFetch } from "@/hooks/useFetch";
import { Form } from "@/components/Form";
import { useRouter } from "next/router";
import { InputVP } from "@/components/InputVP";
import { InputPasswordVP } from "@/components/InputPasswordVP";

export default function WizardIndex() {
    const toast = useToast()
    const router = useRouter()
    const { handleSubmit, control, setValue, watch } = useForm({
        defaultValues: {
            email: "",
            first_name: "",
            last_name: "",
            password: "",
            password_confirm: "",
        }
    });
    const { handleFetch, isLoading } = useFetch()

    const handleCreateAccount = async (data) => {

        const response = await handleFetch("/users/wizard", "POST", data)
        if (response.status == 201) {
            const data = (await response.json()).message
            toast({
                description: data,
                status: 'success',
                duration: 9000,
                isClosable: true,
                variant: "subtle",
                position: 'top-right'
            })
            router.push("/")
        }
        else {
            const data = (await response.json()).error
            toast({
                description: data,
                status: 'error',
                duration: 9000,
                isClosable: true,
                variant: "subtle",
                position: 'top-right'
            })
        }
    }

    return (
        <Stack bg={"#F7FAFC"} h={'100vh'}>

            <Stack
                position={'fixed'}
                left={0}
                top={0}
                w={'100vw'}
                h={'100vh'}
                zIndex={0}
            >
                <Particles
                    particleColors={['#ffffff', '#ff2cd7']}
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

            <Container maxW='5xl' minH={"100%"} alignContent={'center'} position="relative" zIndex={1}>
                <Transition type="bootom" velocity="slow">
                    <Card borderRadius="2xl" overflow="hidden" boxShadow="2xl">
                        <CardBody p={0}>
                            <Flex direction={{ base: "column", md: "row" }} gap={0}>
                                {/* Formulario */}
                                <Flex flex={1} p={{ base: 6, md: 8 }} bg="white">
                                    <VStack spacing={5} align="stretch" w="full">
                                        <Heading size="lg" color="gray.700" fontWeight="semibold">
                                            Crear cuenta
                                        </Heading>
                                        <Divider borderColor="gray.200" />

                                        <Form onSubmit={handleSubmit(handleCreateAccount)}>
                                            <InputVP
                                                value={watch("email")}
                                                isRequired
                                                isDisabled={isLoading}
                                                name="email"
                                                label={("Correo")}
                                                type="text"
                                                rules={{
                                                    required: "Campo requerido"
                                                }}
                                                control={control}
                                                onChange={e => {
                                                    setValue("email", e.target.value)
                                                }}
                                            />

                                            <Flex gap={4} direction={{ base: "column", sm: "row" }}>
                                                <InputVP
                                                    value={watch("first_name")}
                                                    isRequired
                                                    isDisabled={isLoading}
                                                    name="first_name"
                                                    label={("Nombre")}
                                                    type="text"
                                                    rules={{
                                                        required: "Campo requerido"
                                                    }}
                                                    control={control}
                                                    onChange={e => {
                                                        setValue("first_name", e.target.value)
                                                    }}
                                                />
                                                <InputVP
                                                    value={watch("last_name")}
                                                    isRequired
                                                    isDisabled={isLoading}
                                                    name="last_name"
                                                    label={("Apellidos")}
                                                    type="text"
                                                    rules={{
                                                        required: "Campo requerido"
                                                    }}
                                                    control={control}
                                                    onChange={e => {
                                                        setValue("last_name", e.target.value)
                                                    }}
                                                />
                                            </Flex>

                                            <InputPasswordVP
                                                value={watch("password")}
                                                isRequired
                                                isDisabled={isLoading}
                                                name="password"
                                                label={("Contraseña")}
                                                rules={{
                                                    required: "Campo requerido"
                                                }}
                                                control={control}
                                                onChange={e => {
                                                    setValue("password", e.target.value)
                                                }}
                                            />

                                            <InputPasswordVP
                                                value={watch("password_confirm")}
                                                isRequired
                                                isDisabled={isLoading}
                                                name="password_confirm"
                                                label={("Confirmar contraseña")}
                                                rules={{
                                                    required: "Campo requerido",
                                                    validate: value => value === watch("password") || "Las contraseñas no coinciden"
                                                }}
                                                control={control}
                                                onChange={e => {
                                                    setValue("password_confirm", e.target.value)
                                                }}
                                            />

                                            <Button
                                                colorScheme="primary"
                                                size="lg"
                                                borderRadius="full"
                                                mt={2}
                                                bgGradient="linear(to-r, orange.300, primary.500)"
                                                _hover={{ bgGradient: "linear(to-r, orange.600, orange.600)" }}
                                                _active={{ bgGradient: "linear(to-r, orange.700, orange.700)" }}
                                                type="submit"
                                                isLoading={isLoading}
                                            >
                                                Registrarse
                                            </Button>
                                        </Form>

                                    </VStack>
                                </Flex>

                                {/* Imagen lateral */}
                                <Flex
                                    flex={1}
                                    position="relative"
                                    bg="purple.50"
                                    alignItems="center"
                                    justifyContent="center"
                                    p={6}
                                    minH={{ base: "240px", md: "auto" }}
                                >
                                    <Image
                                        src="/wizard.jpg"
                                        alt="Panel de control ilustrativo"
                                        objectFit="cover"
                                        borderRadius="2xl"
                                        
                                        maxH={{ base: "200px", md: "500px" }}
                                      
                                        boxShadow="lg"
                                        fallbackSrc="https://via.placeholder.com/500x400?text=Imagen+de+control"
                                    />
                                </Flex>
                            </Flex>
                        </CardBody>
                    </Card>
                </Transition>
            </Container>
        </Stack>
    )
}