import { ContainerSystem } from "@/components/ContainerSystem";
import {
    Heading,
    Stack,
    VStack,
    HStack,
    FormControl,
    FormLabel,
    Input,
    Button,
    FormErrorMessage,
    useToast,
    Divider,
    Card,
    CardBody,
    CardHeader,
    Spinner,
    Center,
    Container,
    Text
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImageUploadEdit } from "@/components/ImageUploadEdit";
import { useFetch } from "@/hooks/useFetch";
import { InputVP } from "@/components/InputVP";
import { useTranslation } from "react-i18next";
import { UserType } from "@/types/UserType";

type UserProfile = {
    first_name: string | null;
    last_name: string | null;
    email: string;
    photo?: string | null;
};

// Esquema de validación para el formulario de perfil
const profileSchema = z.object({
    photo: z.string().nullable().optional(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    email: z.string().email("Email inválido").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Esquema de validación para cambio de contraseña
const passwordSchema = z
    .object({
        currentPassword: z.string().min(6, "La contraseña actual debe tener al menos 6 caracteres"),
        newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
        confirmPassword: z.string().min(6, "Confirma tu nueva contraseña"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfileIndex({
    user
}: {
    user: UserType
}) {
    const toast = useToast();
    const { handleFetch, isLoading } = useFetch()

    // Formulario de perfil
    const {
        control,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
        reset: resetProfile,
        setValue,
        watch
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            photo: "",
            first_name: "",
            last_name: "",
            email: ""
        },
    });

    // Formulario de contraseña
    const {
        register: passwordRegister,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        const mockUser: UserProfile = {
            photo: user.photo,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };
        resetProfile({
            photo: mockUser.photo,
            first_name: mockUser.first_name || "",
            last_name: mockUser.last_name || "",
            email: mockUser.email
        });
    }, [user])

    const onProfileSubmit = async (data: ProfileFormData) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const response = await handleFetch(
                `/users/${user.id}`,
                'PUT',
                data
            )
            if (response.status === 200) {
                toast({
                    title: "Perfil actualizado",
                    description: "Tus datos se han guardado correctamente",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    variant: 'subtle',
                    position: 'top-right'
                });
            } else {
                toast({
                    description: "Error actualizando perfil",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    variant: 'subtle',
                    position: 'top-right'
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo actualizar el perfil",
                status: "error",
                duration: 5000,
                isClosable: true,
                variant: 'subtle',
                position: 'top-right'
            });
        }
    };

    // Envío del formulario de contraseña
    const onPasswordSubmit = async (data: PasswordFormData) => {
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const response = await handleFetch(
                `/users/change-password/${user.id}`,
                'PUT',
                data
            )
            if (response.status === 200) {
                toast({
                    title: "Contraseña actualizada",
                    description: "Tu contraseña se ha cambiado correctamente",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    variant: 'subtle',
                    position: 'top-right'
                });
            }
            else {
                toast({
                    title: "Error",
                    description: (await response.json()).error,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    variant: 'subtle',
                    position: 'top-right'
                });
            }

            resetPassword(); // Limpiar formulario
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo cambiar la contraseña",
                status: "error",
                duration: 5000,
                isClosable: true,
                variant: 'subtle',
                position: 'top-right'
            });
        }
    };

    if (isLoading) {
        return (
            <ContainerSystem navBarControl={<Stack minW="500px"><Heading size="lg">My Profile</Heading></Stack>}>
                <Center py={10}>
                    <Spinner size="xl" />
                </Center>
            </ContainerSystem>
        );
    }

    return (
        <ContainerSystem
            navBarControl={
                <Stack minW="500px">
                    <Heading size="lg">Mi Perfil</Heading>
                </Stack>
            }
        >
            <Container maxW={'2xl'}>
                <VStack spacing={8} align="stretch" py={4}>

                    <Stack alignItems={'center'}>
                        <Card variant="outline" overflow={'hidden'} >
                            <CardBody p={0}>
                                <ImageUploadEdit
                                    image={watch("photo")} w={125} h={125} width={125} height={125} isDisabled={false} onChangeImage={(image: string | undefined) => {
                                        setValue("photo", image)
                                    }} />
                            </CardBody>
                        </Card>
                    </Stack>

                    <Stack alignItems={'center'}>
                        <Card variant="outline" overflow={'hidden'} >
                            <CardBody p={0}>
                                <Text>{user.wallet} USD</Text>
                            </CardBody>
                        </Card>
                    </Stack>

                    {/* Tarjeta de información del perfil */}
                    <Card variant="outline">
                        <CardHeader>
                            <Heading size="md">Información de Perfil</Heading>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
                                <VStack spacing={4} align="stretch">
                                    <HStack spacing={4} align="flex-start">
                                        <FormControl isInvalid={!!profileErrors.first_name}>
                                            <InputVP
                                                value={watch("first_name")}
                                                isRequired
                                                isDisabled={isLoading}
                                                name="first_name"
                                                label={"Nombre"}
                                                type="text"
                                                rules={{
                                                    required: "Este campo es requerido"
                                                }}
                                                control={control}
                                                onChange={e => {
                                                    setValue("first_name", e.target.value)
                                                }}
                                            />
                                        </FormControl>

                                        <FormControl isInvalid={!!profileErrors.last_name}>
                                            <InputVP
                                                value={watch("last_name")}
                                                isRequired
                                                isDisabled={isLoading}
                                                name="last_name"
                                                label={"Apellidos"}
                                                type="text"
                                                rules={{
                                                    required: "Este campo es requerido"
                                                }}
                                                control={control}
                                                onChange={e => {
                                                    setValue("last_name", e.target.value)
                                                }}
                                            />
                                        </FormControl>
                                    </HStack>

                                    <FormControl isInvalid={!!profileErrors.email}>
                                        <InputVP
                                            value={watch("email")}
                                            isRequired
                                            isDisabled={isLoading}
                                            name="email"
                                            label={"Correo"}
                                            type="text"
                                            rules={{
                                                required: "Este campo es requerido"
                                            }}
                                            control={control}
                                            onChange={e => {
                                                setValue("email", e.target.value)
                                            }}
                                        />
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        alignSelf="flex-start"
                                        isLoading={isLoading}
                                        loadingText="Guardando..."
                                    >
                                        Guardar Cambios
                                    </Button>
                                </VStack>
                            </form>
                        </CardBody>
                    </Card>

                    <Divider />

                    {/* Tarjeta de cambio de contraseña */}
                    <Card variant="outline">
                        <CardHeader>
                            <Heading size="md">Cambiar Contraseña</Heading>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)}>
                                <VStack spacing={4} align="stretch">
                                    <FormControl isInvalid={!!passwordErrors.currentPassword}>
                                        <FormLabel>Contraseña Actual</FormLabel>
                                        <Input
                                            type="password"
                                            {...passwordRegister("currentPassword")}
                                            placeholder="••••••••"
                                        />
                                        <FormErrorMessage>{passwordErrors.currentPassword?.message}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!passwordErrors.newPassword}>
                                        <FormLabel>Nueva Contraseña</FormLabel>
                                        <Input
                                            type="password"
                                            {...passwordRegister("newPassword")}
                                            placeholder="••••••••"
                                        />
                                        <FormErrorMessage>{passwordErrors.newPassword?.message}</FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!passwordErrors.confirmPassword}>
                                        <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                                        <Input
                                            type="password"
                                            {...passwordRegister("confirmPassword")}
                                            placeholder="••••••••"
                                        />
                                        <FormErrorMessage>{passwordErrors.confirmPassword?.message}</FormErrorMessage>
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        alignSelf="flex-start"
                                        isLoading={isLoading}
                                        loadingText="Actualizando..."
                                    >
                                        Actualizar Contraseña
                                    </Button>
                                </VStack>
                            </form>
                        </CardBody>
                    </Card>
                </VStack>
            </Container>
        </ContainerSystem>
    );
}