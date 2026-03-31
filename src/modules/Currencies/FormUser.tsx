import { InputVP } from "@/components/InputVP"
import { Checkbox, Flex, Stack } from "@chakra-ui/react"
import { Control } from "react-hook-form"

export const FormCurrency = ({
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

            <Flex gap={4} alignItems={'center'}>
                <InputVP
                    value={watch('code')}
                    onChange={(e) => setValue('code', e.target.value)}
                    isRequired
                    isDisabled={isLoading}
                    name={findField('code').name}
                    label={findField('code').label}
                    type="text"
                    rules={{
                        required: "Este campo es requerido"
                    }}
                    control={control}
                />
                <Checkbox
                    size={'md'}
                    whiteSpace={'nowrap'}
                    isChecked={watch('isLocal')} onChange={e => { setValue("isLocal", e.target.checked); }}>Es Local</Checkbox>
            </Flex>

            <InputVP
                value={watch('name')}
                onChange={(e) => setValue('name', e.target.value)}
                isRequired
                isDisabled={isLoading}
                name={findField('name').name}
                label={findField('name').label}
                type="text"
                rules={{
                    required: "Este campo es requerido"
                }}
                control={control}
            />

            <InputVP
                value={watch('exchangeRateToUsd')}
                onChange={(e) => setValue('exchangeRateToUsd', e.target.value)}
                isRequired
                isDisabled={isLoading}
                name={findField('exchangeRateToUsd').name}
                label={findField('exchangeRateToUsd').label}
                type="text"
                rules={{
                    required: "Este campo es requerido"
                }}
                control={control}
            />

            <Checkbox
                size={'md'}
                whiteSpace={'nowrap'}
                isChecked={watch('isCardOnly')} onChange={e => { setValue("isCardOnly", e.target.checked); }}>
                Usada Solo en Tarjeta
            </Checkbox>

        </Stack>
    )

}