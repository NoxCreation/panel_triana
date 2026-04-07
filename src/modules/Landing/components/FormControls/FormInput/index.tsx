import { FormControl, FormLabel, Input } from "@chakra-ui/react";

export const FormInput = ({
    value,
    label,
    isLoading,
    placeholder,
    onChange
}: {
    value: string;
    label: string;
    isLoading: boolean;
    placeholder?: string;
    onChange: (e: any) => void;
}) => {

    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <Input placeholder={placeholder}
                isDisabled={isLoading}
                value={value}
                onChange={e => onChange(e)}
            />
        </FormControl>
    )
}