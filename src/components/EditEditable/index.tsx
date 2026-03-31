"use client"

import { useState, useEffect, Fragment, useRef } from "react"
import {
    ButtonGroup,
    IconButton,
    Flex,
    Input,
    FormHelperText,
    FormControl,
    type InputProps,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    PopoverArrow,
    Box,
} from "@chakra-ui/react"
import { FiCheckSquare, FiX, FiEdit } from "react-icons/fi"
import { Editable, EditablePreview, EditableInput, useEditableControls, Text } from "@chakra-ui/react"
import { type Control, Controller } from "react-hook-form"

type Props = {
    value: string | number
    control?: Control<any>
    name?: string
    rules?: any
    onChange: (value: any, returnState?: (value: any) => void) => void
    isDisabled?: boolean
    loading?: boolean
    floatButtons?: boolean
    isNumber?: boolean
    isDecimal?: boolean
    min?: number
    max?: number
} & InputProps

export function EditEditable({
    value,
    control,
    name,
    rules,
    loading,
    isDisabled,
    onChange,
    floatButtons = false,
    isNumber = false,
    isDecimal = false,
    min,
    max,
    ...props
}: Props) {
    const [t, st] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentValue, setCurrentValue] = useState<string>(value?.toString() || '')
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const initialFocusRef = useRef(null)

    const onReturnState = (value: any) => {
        setCurrentValue(value?.toString() || '')
    }

    useEffect(() => {
        setCurrentValue(value?.toString() || '')
    }, [value])

    useEffect(() => {
        if (!t) {
            st(true)
            return
        }
        if (!isEditing && !isPopoverOpen) {
            handleChangeFinal(currentValue)
        }
    }, [isEditing, isPopoverOpen])

    const handleChange = (newValue: string) => {
        if (isNumber) {
            // Validación para números
            const regex = isDecimal ? /^[0-9,]*\.?[0-9]*$/ : /^[0-9]*$/
            if (!regex.test(newValue)) return
        }
        setCurrentValue(newValue)
    }

    const handleChangeFinal = (value: string) => {
        let finalValue: string | number = value

        if (isNumber) {
            // Convertir a número y aplicar validaciones
            const numericValue = value === '' ? 0 : parseFloat(value.replace(',', '.'))
            finalValue = numericValue

            // Aplicar límites
            if (min !== undefined && numericValue < min) finalValue = min
            if (max !== undefined && numericValue > max) finalValue = max
            if (isNaN(numericValue)) finalValue = 0

            // Actualizar el valor mostrado
            setCurrentValue(finalValue.toString())
        }

        onChange(finalValue, onReturnState)
    }

    const handleSave = () => {
        if (floatButtons) {
            setIsPopoverOpen(false)
            handleChangeFinal(currentValue)
        }
    }

    const handleCancel = () => {
        if (floatButtons) {
            setIsPopoverOpen(false)
            setCurrentValue(value?.toString() || '') // Reset to original value
        }
    }

    function StandardEditableControls() {
        const {
            isEditing: isEditingControl,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls()

        useEffect(() => {
            setIsEditing(isEditingControl)
        }, [isEditingControl])

        return isEditingControl ? (
            <ButtonGroup justifyContent="center" size="sm">
                <IconButton
                    aria-label="Confirmar"
                    icon={<FiCheckSquare />}
                    {...getSubmitButtonProps()}
                    size="sm"
                    variant="ghost"
                    onClick={() => handleChangeFinal(currentValue)}
                />
                <IconButton
                    aria-label="Cancelar"
                    icon={<FiX />}
                    {...getCancelButtonProps()}
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                        setCurrentValue(value?.toString() || '');
                        // Forzar el cierre del modo edición
                        const cancelProps = getCancelButtonProps();
                        if (cancelProps.onClick) {
                            (cancelProps as any).onClick();
                        }
                    }}
                />
            </ButtonGroup>
        ) : (
            <Flex justifyContent="center">
                <IconButton
                    aria-label="Editar"
                    icon={<FiEdit />}
                    {...getEditButtonProps()}
                    size="sm"
                    variant="ghost"
                    isDisabled={loading || isDisabled}
                />
            </Flex>
        )
    }

    const renderInputField = (field?: any) => (
        <Input
            {...props}
            {...field}
            ref={initialFocusRef as any}
            value={currentValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={() => handleChangeFinal(currentValue)}
            size="sm"
            mb={2}
            type={isNumber ? (isDecimal ? "number" : "tel") : "text"}
            inputMode={isNumber ? (isDecimal ? "decimal" : "numeric") : "text"}
        />
    )

    const renderWithController = () => (
        <FormControl>
            <Controller
                name={name!}
                control={control!}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <>
                        {floatButtons ? (
                            <Box
                                border="1px solid"
                                borderColor={error ? "red.400" : "gray.200"}
                                display="flex"
                                flexDir="row"
                                gap={2}
                                pr={1}
                                pl={2}
                                borderRadius="8px"
                                alignItems="center"
                                w={"100%"}
                            >
                                <Box flex={1} textAlign="left" fontSize="sm">
                                    {currentValue}
                                </Box>
                                <Popover
                                    isOpen={isPopoverOpen}
                                    onClose={handleCancel}
                                    initialFocusRef={initialFocusRef}
                                    placement="bottom"
                                >
                                    <PopoverTrigger>
                                        <IconButton
                                            aria-label="Edit"
                                            icon={<FiEdit />}
                                            size="sm"
                                            variant="ghost"
                                            isDisabled={loading || isDisabled}
                                            onClick={() => setIsPopoverOpen(true)}
                                        />
                                    </PopoverTrigger>
                                    <PopoverContent p={2} width="auto">
                                        <PopoverArrow />
                                        <PopoverBody>
                                            {renderInputField(field)}
                                            <ButtonGroup justifyContent="flex-end" size="sm" width="100%">
                                                <IconButton
                                                    aria-label="Cancel"
                                                    icon={<FiX />}
                                                    onClick={handleCancel}
                                                    size="sm"
                                                    variant="ghost"
                                                />
                                                <IconButton
                                                    aria-label="Confirm"
                                                    icon={<FiCheckSquare />}
                                                    onClick={handleSave}
                                                    size="sm"
                                                    variant="ghost"
                                                />
                                            </ButtonGroup>
                                        </PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </Box>
                        ) : (
                            <Editable
                                textAlign="center"
                                defaultValue={value?.toString()}
                                fontSize="sm"
                                isPreviewFocusable={false}
                                border="1px solid"
                                borderColor={error ? "red.400" : "gray.200"}
                                display="flex"
                                flexDir="row"
                                gap={2}
                                pr={1}
                                borderRadius="8px"
                                alignItems="center"
                                value={currentValue}
                                onChange={handleChange}
                                onSubmit={handleChangeFinal}
                                w={"100%"}
                                isDisabled={isDisabled}
                            >
                                <EditablePreview flex={1} bg={"white"} />
                                <Input
                                    as={EditableInput}
                                    {...field}
                                    {...props}
                                    isDisabled={isDisabled}
                                    type={isNumber ? (isDecimal ? "number" : "tel") : "text"}
                                    inputMode={isNumber ? (isDecimal ? "decimal" : "numeric") : "text"}
                                />
                                <StandardEditableControls />
                            </Editable>
                        )}
                        <FormHelperText>{error ? error.message : ""}</FormHelperText>
                    </>
                )}
            />
        </FormControl>
    )

    const renderWithoutController = () => (
        <>
            {floatButtons ? (
                <Box
                    border="1px solid"
                    borderColor="gray.200"
                    display="flex"
                    flexDir="row"
                    gap={2}
                    pr={1}
                    pl={2}
                    borderRadius="8px"
                    alignItems="center"
                    w={"100%"}
                >
                    <Box flex={1} textAlign="left" fontSize="sm">
                        {currentValue}
                    </Box>
                    <Popover isOpen={isPopoverOpen} onClose={handleCancel} initialFocusRef={initialFocusRef} placement="bottom">
                        <PopoverTrigger>
                            <IconButton
                                aria-label="Edit"
                                icon={<FiEdit />}
                                size="sm"
                                variant="ghost"
                                isDisabled={loading || isDisabled}
                                onClick={() => setIsPopoverOpen(true)}
                            />
                        </PopoverTrigger>
                        <PopoverContent p={2} width="auto">
                            <PopoverArrow />
                            <PopoverBody>
                                {renderInputField()}
                                <ButtonGroup justifyContent="flex-end" size="sm" width="100%">
                                    <IconButton aria-label="Cancel" icon={<FiX />} onClick={handleCancel} size="sm" variant="ghost" />
                                    <IconButton
                                        aria-label="Confirm"
                                        icon={<FiCheckSquare />}
                                        onClick={handleSave}
                                        size="sm"
                                        variant="ghost"
                                    />
                                </ButtonGroup>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </Box>
            ) : (
                <Editable
                    textAlign="center"
                    defaultValue={value?.toString()}
                    fontSize="sm"
                    isPreviewFocusable={false}
                    border="1px solid"
                    borderColor="gray.200"
                    display="flex"
                    flexDir="row"
                    gap={2}
                    pr={1}
                    pl={2}
                    borderRadius="8px"
                    alignItems="center"
                    value={currentValue}
                    onChange={handleChange}
                    onSubmit={handleChangeFinal}
                    w={"100%"}
                    isDisabled={loading || isDisabled}
                >
                    {/* <EditablePreview flex={1} /> */}
                    {!isEditing && <Text w="100%">{currentValue}</Text>}
                    <Input
                        as={EditableInput}
                        {...props}
                        isDisabled={loading || isDisabled}
                        type={isNumber ? (isDecimal ? "number" : "tel") : "text"}
                        inputMode={isNumber ? (isDecimal ? "decimal" : "numeric") : "text"}
                    />
                    <StandardEditableControls />
                </Editable>
            )}
        </>
    )

    return (
        <Fragment>
            {control != undefined && name != undefined && rules != undefined
                ? renderWithController()
                : renderWithoutController()}
        </Fragment>
    )
}