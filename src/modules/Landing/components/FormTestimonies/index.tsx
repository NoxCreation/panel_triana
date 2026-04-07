import { InputVP } from "@/components/InputVP";
import { useForm } from "react-hook-form";
import {
    Button,
    VStack,
} from "@chakra-ui/react";
import { TestimoniesType } from "@/types/TestimoniesType";
import { TextareaVP } from "@/components/TextareaVP";
import { generateID } from "@/utils/generateID";

export const FormTestimonies = ({
    init,
    onAddTestimonie
}: {
    init: TestimoniesType,
    onAddTestimonie: (data: any, init: undefined | TestimoniesType) => void
}) => {
    const isLoading = false;

    const { handleSubmit, control, setValue, watch } = useForm<TestimoniesType>({
        defaultValues: init ? init : {
            name: "",
            position: "",
            comment: "",
            publish: false
        },
    });

    // Sincronizar los arrays locales con el formulario al enviar
    const onSubmit = (data: TestimoniesType) => {
        const finalData = {
            id: generateID(),
            ...data,
        };
        onAddTestimonie(finalData, init)
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch" flex={1}>
                {/* Título */}
                <InputVP
                    name="name"
                    label="Nombre"
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                    isDisabled={isLoading}
                    type="text"
                    isRequired
                    onChange={(e) => {
                        setValue("name", e.target.value)
                    }}
                />

                {/* Position */}
                <InputVP
                    name="position"
                    label="Posición"
                    control={control}
                    type="text"
                    rules={{}}
                    isRequired
                    onChange={(e) => {
                        setValue("position", e.target.value)
                    }}
                />

                {/* Position */}
                <TextareaVP
                    name="comment"
                    label="Comentario"
                    control={control}
                    rules={{}}
                    isRequired
                    onChange={(e) => {
                        setValue("comment", e.target.value)
                    }}
                />

                <Button type="submit" isLoading={isLoading} colorScheme="purple">
                    Guardar testimonio
                </Button>
            </VStack>
        </form>
    );
};