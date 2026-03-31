import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { FormControl, FormLabel, FormHelperText, TextareaProps, Box, Textarea } from '@chakra-ui/react';

type CustomInputProps = {
    name: string;
    label: string;
    rules: any;
    control: Control<any>;
    ref?: any
    isRequired?: boolean,
} & TextareaProps

export const TextareaVP: React.FC<CustomInputProps> = ({ name, label, rules, control, ref, isRequired, ...props }) => (
    <FormControl>
        <FormLabel>{label} {isRequired && <Box as="span" color={'red'}>*</Box>}</FormLabel>
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <>
                    <Textarea {...field} ref={ref} {...props} isInvalid={error != undefined}></Textarea>
                    <FormHelperText>
                        {error ? error.message : ""}
                    </FormHelperText>
                </>
            )}
        />
    </FormControl>
);
