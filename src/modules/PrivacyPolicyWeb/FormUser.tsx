import { ImageUploadEdit } from "@/components/ImageUploadEdit"
import { InputVP } from "@/components/InputVP"
import { Stack } from "@chakra-ui/react"
import { Control } from "react-hook-form"

export const FormUser = ({
    fields,
    isLoading,
    control,
    watch,
    setValue
}: {
    fields: any
    isLoading: boolean
    control: Control<any, any>
    watch: (value: any) => any
    setValue: (key: any, value: any) => any
}) => {
    const findField = (name: string) => fields.find(e => e.name == name)

    return (
        <Stack>
            <Stack alignItems={'center'}>
                <ImageUploadEdit image={watch('photo')} w={200} h={200} width={200} height={200} onChangeImage={(image: string | undefined) => {
                    setValue('photo', image)
                }} />
            </Stack>

            <InputVP
                value={watch('email')}
                onChange={(e) => setValue('email', e.target.value)}
                isRequired
                isDisabled={isLoading}
                name={findField('email').name}
                label={findField('email').label}
                type="text"
                rules={{
                    required: "Este campo es requerido"
                }}
                control={control}
            />

            <InputVP
                value={watch('first_name')}
                onChange={(e) => setValue('first_name', e.target.value)}
                isRequired
                isDisabled={isLoading}
                name={findField('first_name').name}
                label={findField('first_name').label}
                type="text"
                rules={{
                    required: "Este campo es requerido"
                }}
                control={control}
            />

            <InputVP
                value={watch('last_name')}
                onChange={(e) => setValue('last_name', e.target.value)}
                isRequired
                isDisabled={isLoading}
                name={findField('last_name').name}
                label={findField('last_name').label}
                type="text"
                rules={{
                    required: "Este campo es requerido"
                }}
                control={control}
            />

            <InputVP
                value={watch('password')}
                onChange={(e) => setValue('password', e.target.value)}
                isRequired
                isDisabled={isLoading}
                name={findField('password').name}
                label={findField('password').label}
                type="password"
                rules={{
                    required: "Este campo es requerido"
                }}
                control={control}
            />

        </Stack>
    )

}