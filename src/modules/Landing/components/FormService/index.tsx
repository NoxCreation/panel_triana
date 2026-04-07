import { InputVP } from "@/components/InputVP";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
    Button,
    Select,
    VStack,
    HStack,
    Tag,
    TagLabel,
    TagCloseButton,
    Input,
    Text,
    Flex,
    Stack,
    FormControl,
    FormLabel,
} from "@chakra-ui/react";
import { useState } from "react";
import TextEditor from "@/components/TextEditor";
import { generateID } from "@/utils/generateID";
import { ServiceType } from "@/types/ServiceType";
import { generarSlug } from "@/utils/generarSlug";

export const FormService = ({
    init,
    onAddService
}: {
    init: ServiceType,
    onAddService: (data: any, init: undefined | ServiceType) => void
}) => {
    const isLoading = false;

    // Estados locales para los arrays de strings
    const [includeList, setIncludeList] = useState<string[]>(init ? init.include : []);
    const [notIncludeList, setNotIncludeList] = useState<string[]>(init ? init.notInclude :[]);
    const [requirementList, setRequirementList] = useState<string[]>(init ? init.requirement : []);

    const { handleSubmit, control, setValue, watch } = useForm<ServiceType>({
        defaultValues: init ? init : {
            title: "",
            description: "",
            tiquet: [],
            type: "weekly",
            price: 0,
            include: [],
            notInclude: [],
            requireLabel: "",
            requirement: [],
        },
    });

    // FieldArray para tiquet (objetos)
    const { fields: tiquetFields, append: appendTiquet, remove: removeTiquet } = useFieldArray({
        control,
        name: "tiquet",
    });

    // Sincronizar los arrays locales con el formulario al enviar
    const onSubmit = (data: ServiceType) => {
        const finalData = {
            id: generateID(),
            slug: generarSlug(data.title),
            ...data,
            include: includeList,
            notInclude: notIncludeList,
            requirement: requirementList,
        };
        onAddService(finalData, init)
    };

    // Handlers para agregar/remover elementos en los arrays locales
    const handleAddInclude = (value: string) => {
        if (value.trim()) {
            setIncludeList((prev) => [...prev, value.trim()]);
        }
    };

    const handleRemoveInclude = (index: number) => {
        setIncludeList((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddNotInclude = (value: string) => {
        if (value.trim()) {
            setNotIncludeList((prev) => [...prev, value.trim()]);
        }
    };

    const handleRemoveNotInclude = (index: number) => {
        setNotIncludeList((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddRequirement = (value: string) => {
        if (value.trim()) {
            setRequirementList((prev) => [...prev, value.trim()]);
        }
    };

    const handleRemoveRequirement = (index: number) => {
        setRequirementList((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddTiquet = (label: string, variant: "primary" | "outline") => {
        if (label.trim()) {
            appendTiquet({ label: label.trim(), variant });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Flex gap={4}>
                <VStack spacing={4} align="stretch" flex={1}>
                    {/* Título */}
                    <InputVP
                        name="title"
                        label="Título"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        isDisabled={isLoading}
                        type="text"
                        onChange={(e) => {
                            setValue("title", e.target.value)
                        }}
                    />

                    {/* Etiquetas (tiquet) */}
                    <VStack align="stretch">
                        <Text fontWeight="bold">Etiquetas</Text>
                        <HStack>
                            <Input
                                placeholder="Nombre de la etiqueta"
                                id="newTiquetLabel"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        const input = e.currentTarget;
                                        const variantSelect = document.getElementById("tiquetVariant") as HTMLSelectElement;
                                        const variant = variantSelect?.value as "primary" | "outline";
                                        handleAddTiquet(input.value, variant);
                                        input.value = "";
                                    }
                                }}
                            />
                            <Select id="tiquetVariant" w="150px">
                                <option value="primary">Primary</option>
                                <option value="outline">Outline</option>
                            </Select>
                            <Button
                                onClick={() => {
                                    const input = document.getElementById("newTiquetLabel") as HTMLInputElement;
                                    const variantSelect = document.getElementById("tiquetVariant") as HTMLSelectElement;
                                    handleAddTiquet(input.value, variantSelect.value as "primary" | "outline");
                                    input.value = "";
                                }}
                            >
                                Agregar
                            </Button>
                        </HStack>
                        <HStack spacing={2} flexWrap="wrap">
                            {tiquetFields.map((field, index) => (
                                <Tag
                                    key={field.id}
                                    size="lg"
                                    variant={field.variant === "primary" ? "solid" : "outline"}
                                    colorScheme={field.variant === "primary" ? "purple" : "gray"}
                                >
                                    <TagLabel>{field.label}</TagLabel>
                                    <TagCloseButton onClick={() => removeTiquet(index)} />
                                </Tag>
                            ))}
                        </HStack>
                    </VStack>

                    {/* Tipo de servicio */}
                    <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                            <Select {...field}>
                                <option value="weekly">Semanal</option>
                                <option value="diary">Diario</option>
                                <option value="single_payment">Pago único</option>
                                <option value="session">Por sesión</option>
                                <option value="monthly">Mensual</option>
                            </Select>
                        )}
                    />

                    {/* Precio */}
                    <InputVP
                        name="price"
                        label="Precio"
                        type="number"
                        control={control}
                        rules={{ required: "Este campo es requerido", min: 0 }}
                        isDisabled={isLoading}
                        onChange={(e) => {
                            setValue("price", parseFloat(e.target.value))
                        }}
                    />

                    {/* Incluye */}
                    <VStack align="stretch">
                        <Text fontWeight="bold">Incluye</Text>
                        <HStack>
                            <Input
                                placeholder="Ej: Asesoría personalizada"
                                id="newInclude"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddInclude(e.currentTarget.value);
                                        e.currentTarget.value = "";
                                    }
                                }}
                            />
                            <Button
                                onClick={() => {
                                    const input = document.getElementById("newInclude") as HTMLInputElement;
                                    handleAddInclude(input.value);
                                    input.value = "";
                                }}
                            >
                                Agregar
                            </Button>
                        </HStack>
                        <HStack spacing={2} flexWrap="wrap">
                            {includeList.map((item, index) => (
                                <Tag key={index} size="lg" colorScheme="green">
                                    <TagLabel>{item}</TagLabel>
                                    <TagCloseButton onClick={() => handleRemoveInclude(index)} />
                                </Tag>
                            ))}
                        </HStack>
                    </VStack>

                    {/* No incluye */}
                    <VStack align="stretch">
                        <Text fontWeight="bold">No incluye</Text>
                        <HStack>
                            <Input
                                placeholder="Ej: Viajes"
                                id="newNotInclude"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddNotInclude(e.currentTarget.value);
                                        e.currentTarget.value = "";
                                    }
                                }}
                            />
                            <Button
                                onClick={() => {
                                    const input = document.getElementById("newNotInclude") as HTMLInputElement;
                                    handleAddNotInclude(input.value);
                                    input.value = "";
                                }}
                            >
                                Agregar
                            </Button>
                        </HStack>
                        <HStack spacing={2} flexWrap="wrap">
                            {notIncludeList.map((item, index) => (
                                <Tag key={index} size="lg" colorScheme="red">
                                    <TagLabel>{item}</TagLabel>
                                    <TagCloseButton onClick={() => handleRemoveNotInclude(index)} />
                                </Tag>
                            ))}
                        </HStack>
                    </VStack>

                    {/* Etiqueta de requisito (opcional) */}
                    <InputVP
                        name="requireLabel"
                        label="Etiqueta de requisito (opcional)"
                        control={control}
                        type="text"
                        rules={{}}
                        onChange={(e) => {
                            setValue("requireLabel", e.target.value)
                        }}
                    />

                    {/* Requisitos */}
                    <VStack align="stretch">
                        <Text fontWeight="bold">Requisitos</Text>
                        <HStack>
                            <Input
                                placeholder="Ej: Experiencia previa"
                                id="newRequirement"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddRequirement(e.currentTarget.value);
                                        e.currentTarget.value = "";
                                    }
                                }}
                            />
                            <Button
                                onClick={() => {
                                    const input = document.getElementById("newRequirement") as HTMLInputElement;
                                    handleAddRequirement(input.value);
                                    input.value = "";
                                }}
                            >
                                Agregar
                            </Button>
                        </HStack>
                        <HStack spacing={2} flexWrap="wrap">
                            {requirementList.map((item, index) => (
                                <Tag key={index} size="lg" colorScheme="orange">
                                    <TagLabel>{item}</TagLabel>
                                    <TagCloseButton onClick={() => handleRemoveRequirement(index)} />
                                </Tag>
                            ))}
                        </HStack>
                    </VStack>

                    <Button type="submit" isLoading={isLoading} colorScheme="purple">
                        Guardar servicio
                    </Button>
                </VStack>
                <Stack flex={1}>
                    <FormControl>
                        <FormLabel fontWeight="medium" color="gray.600">Descripción del servicio</FormLabel>
                        <TextEditor
                            body={watch("description")}
                            loading={false}
                            setBody={(html) => {
                                setValue('description', html)
                            }}
                        />
                    </FormControl>
                </Stack>
            </Flex>
        </form>
    );
};