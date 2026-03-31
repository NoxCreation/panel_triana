import { InputVP } from "@/components/InputVP"
import { useFetch } from "@/hooks/useFetch"
import { Button, Stack, useToast } from "@chakra-ui/react"
import { useMemo } from "react"
import { Control, useForm } from 'react-hook-form'
import { useTranslation } from "react-i18next"

export type FieldCrud = {
    name: string,
    label: string
    default: string | boolean
    type: 'string' | 'json' | 'number' | 'imageBase64' | 'boolean'
}

interface CrudDrawerProps {
    fields: Array<FieldCrud>
    initialice?: any
    endpoint: string
    onClose: () => void
    FieldComponent?: React.ComponentType<{
        fields: Array<FieldCrud>
        isLoading: boolean
        control: Control<any, any>
        watch: (fieldName: any) => any
        setValue: (fieldName: any, value: any) => void
        formValues?: Record<string, any>
        onChange?: (fieldName: string, value: any) => void
    }>
}

const convertTo = (data: any, fields: Array<FieldCrud>) => {
    const temp = { ...data }
    fields.forEach(field => {
        if (field.type == 'string') {
            temp[field.name] = `${temp[field.name]}`
        }
        else if (field.type == 'json') {
            temp[field.name] = JSON.parse(temp[field.name])
        }
        else if (field.type == 'number') {
            temp[field.name] = parseFloat(temp[field.name])
        }
        else if (field.type == 'boolean') {
            temp[field.name] = temp[field.name]
        }
    })
    return temp
}

const convertFrom = (data: any, fields: Array<FieldCrud>) => {
    const temp = { ...data }
    fields.forEach(field => {
        if (field.type == 'string' || field.type == 'number') {
            temp[field.name] = `${temp[field.name]}`
        }
        else if (field.type == 'json') {
            temp[field.name] = JSON.stringify(temp[field.name])
        }
    })
    return temp
}

export const CrudDrawer = ({ fields, initialice, endpoint, onClose, FieldComponent }: CrudDrawerProps) => {
    const { t } = useTranslation('nomenclators');
    const toast = useToast()

    const defaultValues = useMemo(() => {
        if (initialice) {
            return convertFrom(initialice, fields)
        }
        return fields.map(f => ({
            [f.name]: f.default
        })).reduce((p, c) => ({ ...p, ...c }), {})
    }, [fields, initialice])

    const { handleSubmit, control, setValue, watch } = useForm<any>({
        defaultValues
    })
    const { handleFetch, isLoading } = useFetch()

    const onSubmit = async (data: any) => {

        // Modificando segun el tipo de datos
        data = convertTo(data, fields)

        try {
            if (initialice?.id) {
                const response = await handleFetch(
                    `${endpoint}/${initialice.id}/`,
                    'PUT',
                    data
                )
                if (response.status == 200)
                    onClose()
                else {
                    const data = await response.json()
                    toast({
                        description: data.error,
                        position: "top-right",
                        variant: 'subtle',
                        status: 'error',
                        isClosable: true
                    })
                }
            }
            else {
                const response = await handleFetch(
                    endpoint,
                    'POST',
                    data
                )
                if (response.status == 201)
                    onClose()
                else {
                    const data = await response.json()
                    toast({
                        description: data.error,
                        position: "top-right",
                        variant: 'subtle',
                        status: 'error',
                        isClosable: true
                    })
                }
            }

        } catch (error) {
            console.error("Error saving client:", error)
            alert(t("server_error", "Server error"))
            toast({
                description: "Server error",
                position: "top-right",
                variant: 'subtle',
                status: 'error',
                isClosable: true
            })
        }
    }

    const formFields = useMemo(() => fields, [fields])

    return (
        <Stack spacing={4}>
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Si se proporciona un componente personalizado, usarlo */}
                {FieldComponent ? (
                    <FieldComponent
                        fields={fields}
                        isLoading={isLoading}
                        control={control}
                        watch={watch}
                        setValue={setValue}
                    />
                ) : (
                    formFields.map(field => (<InputVP
                        value={watch(field.name)}
                        onChange={(e) => {
                            setValue(field.name, e.target.value)
                        }}
                        isRequired
                        isDisabled={isLoading}
                        name={field.name}
                        label={field.label}
                        type="text"
                        rules={{
                            required: t("required_field", "This field is required", { ns: 'common' })
                        }}
                        control={control}
                    />))
                )}

                <Button
                    type="submit"
                    isLoading={isLoading}
                    width="full"
                    mt={4}
                >
                    {t("save_client", "Save")}
                </Button>
            </form>
        </Stack>
    )
}