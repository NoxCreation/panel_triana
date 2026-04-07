import { FormControl, FormLabel, Textarea, TextareaProps } from "@chakra-ui/react";

type Props = {
    value: string;
    label: string;
    isLoading: boolean;
    placeholder?: string;
    onChange: (e: any) => void;
} & TextareaProps

export const FormTextarea = ({
    value,
    label,
    isLoading,
    placeholder,
    onChange,
    ...props
}: Props) => {

    return (
        <FormControl>
            <FormLabel>{label}</FormLabel>
            <Textarea rows={2} placeholder={placeholder}
                isDisabled={isLoading}
                value={value}
                onChange={e => onChange(e)}
                {...props}
            />
        </FormControl>
    )
}