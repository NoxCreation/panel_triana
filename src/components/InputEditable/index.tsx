import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons"
import { ButtonGroup, Flex, IconButton, Input, Box } from "@chakra-ui/react"
import { useState, useEffect, useRef } from "react"

interface InputEditableProps {
    value?: string
    onSubmit?: (value: string) => Promise<boolean> | boolean | void
    onCancel?: () => void
    placeholder?: string
    fontSize?: string
    isSubmitting?: boolean
}

export function InputEditable({
    value = "",
    onSubmit,
    onCancel,
    placeholder = "Haz clic para editar",
    fontSize = "2xl",
    isSubmitting = false
}: InputEditableProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const inputRef = useRef<HTMLInputElement>(null)

    // Sincronizar con el valor del padre
    useEffect(() => {
        setEditValue(value)
    }, [value])

    // Enfocar el input cuando empieza a editar
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    const handleSubmit = async () => {
        if (!onSubmit) {
            setIsEditing(false)
            return
        }

        const result = await onSubmit(editValue)

        if (result === true || result === undefined) {
            // Si el submit fue exitoso o no retornó nada, cerramos edición
            setIsEditing(false)
        }
        // Si retornó false, mantenemos el modo edición
    }

    const handleCancel = () => {
        setEditValue(value) // Restaurar valor original
        setIsEditing(false)
        if (onCancel) {
            onCancel()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit()
        } else if (e.key === 'Escape') {
            handleCancel()
        }
    }

    if (!isEditing) {
        return (
            <Flex align="center" justify="center">
                <Box
                    px={2}
                    py={1}
                    fontSize={fontSize}
                    onClick={() => setIsEditing(true)}
                    cursor="pointer"
                    _hover={{ background: 'gray.100' }}
                    borderRadius="md"
                >
                    {value || placeholder}
                </Box>
                <IconButton
                    aria-label="Editar"
                    size='sm'
                    icon={<EditIcon />}
                    onClick={() => setIsEditing(true)}
                    ml={2}
                />
            </Flex>
        )
    }

    return (
        <Flex align="center" justify="center">
            <Input
                ref={inputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                fontSize={fontSize}
                px={2}
                py={1}
                isDisabled={isSubmitting}
            />
            <ButtonGroup size='sm' ml={2}>
                <IconButton
                    aria-label="Guardar"
                    icon={<CheckIcon />}
                    colorScheme="green"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                />
                <IconButton
                    aria-label="Cancelar"
                    icon={<CloseIcon />}
                    colorScheme="red"
                    onClick={handleCancel}
                    isDisabled={isSubmitting}
                />
            </ButtonGroup>
        </Flex>
    )
}