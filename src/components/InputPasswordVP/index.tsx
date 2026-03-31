import React, { useState } from 'react';
import { Controller, Control } from 'react-hook-form';
import {
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    InputProps,
    Box,
    InputGroup,
    InputRightElement,
    IconButton
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

type CustomInputProps = {
    name: string;
    label: string;
    rules: any;
    control: Control<any>;
    ref?: any
    isRequired?: boolean
} & InputProps

export const InputPasswordVP: React.FC<CustomInputProps> = ({ name, label, rules, control, ref, isRequired, ...props }) => {
    const [type, set_type] = useState('password' as "password" | "text")
    const toogleClick = () => type == "password" ? set_type("text") : set_type("password")

    return (
        <FormControl>
            <FormLabel>{label} {isRequired && <Box as="span" color={'red'}>*</Box>}</FormLabel>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <InputGroup>
                            <Input {...field} ref={ref} {...props} type={type} isInvalid={error != undefined} />
                            <InputRightElement width='2.5rem'>
                                <IconButton
                                    onClick={toogleClick}
                                    variant={'ghost'} aria-label='' icon={type == "text" ? <FiEye /> : <FiEyeOff />} />
                            </InputRightElement>
                        </InputGroup>
                        <FormHelperText>
                            {error ? error.message : ""}
                        </FormHelperText>
                    </>
                )}
            />
        </FormControl>
    )
}
