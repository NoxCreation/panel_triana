import React from 'react';
import { Controller, Control } from 'react-hook-form';
import { FormControl, FormLabel, Select, FormHelperText, Box, SelectProps } from '@chakra-ui/react';

type CustomSelectProps = {
    name: string;
    label?: string;
    options: { value: string; label: string }[];
    rules: any;
    control: Control<any>;
    isRequired?: boolean;
    defaultValue?: string;
} & SelectProps

export const SelectVP: React.FC<CustomSelectProps> = ({ name, label, options, rules, control, isRequired, defaultValue = 'default', ...props }) => (
    <FormControl>
        {label && <FormLabel>
            {label} {isRequired && <Box as="span" color="red">*</Box>}
        </FormLabel>}
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <>
                    <Select {...field} isInvalid={!!error} defaultValue={defaultValue} {...props}
                    >
                        <option value="">
                            Select an option
                        </option>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                    <FormHelperText>{error ? error.message : ''}</FormHelperText>
                </>
            )}
        />
    </FormControl>
);
