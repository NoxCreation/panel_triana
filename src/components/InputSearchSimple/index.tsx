import { Input, InputProps } from "@chakra-ui/react"
import { useState, KeyboardEvent } from "react"

interface InputSearchSimpleProps extends Omit<InputProps, 'onSubmit'> {
    onSearch?: (value: string) => void
}

export const InputSearchSimple = ({ onSearch, ...rest }: InputSearchSimpleProps) => {
    const [value, setValue] = useState('')

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(value)
        }
    }

    return (
        <Input
            w={{ base: "100%", md: "300px" }}
            placeholder="Buscar ..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            {...rest} // permite pasar cualquier otra prop de Input
        />
    )
}