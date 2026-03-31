import React from 'react';
import { Controller, Control } from 'react-hook-form';
import {
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    InputProps,
    Box,
    InputGroup,
    InputRightAddon
} from '@chakra-ui/react';

type CustomInputProps = {
    name: string;
    label: string;
    type:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
    rules: any;
    control: Control<any>;
    ref?: any;
    labelHelp?: string;
    isRequired?: boolean;
    rightAddon?: any;
    displayNone?: boolean
    onChange?: (value: any) => void
} & InputProps;

export const InputVP: React.FC<CustomInputProps> = ({
    name,
    label,
    type,
    rules,
    control,
    ref,
    isRequired,
    rightAddon,
    labelHelp,
    displayNone,
    onChange,
    ...props
}) => (
    <FormControl display={displayNone ? 'none' : 'inline'}>
        <FormLabel fontWeight="medium" color="gray.600">
            {label} {isRequired && <Box as="span" color={'red'}>*</Box>}
        </FormLabel>
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState: { error } }) => (
                <>
                    <InputGroup>
                        <Input
                            {...field}
                            type={type}
                            ref={ref}
                            {...props}
                            isInvalid={error != undefined}
                            onChange={(e) => {
                                //const value = allUpperCase ? e.target.value.toUpperCase() : e.target.value;
                                //field.onChange(value);
                                if (onChange)
                                    onChange(e)
                            }}
                        />
                        {rightAddon && (
                            <InputRightAddon
                                h={"auto"}
                                w={"auto"}
                                fontSize={"xs"}
                                p={1}
                                px={2}
                                flex={1}
                            >
                                {rightAddon}
                            </InputRightAddon>
                        )}
                    </InputGroup>
                    {labelHelp && <FormHelperText>{labelHelp}</FormHelperText>}
                    <FormHelperText>{error ? error.message : ""}</FormHelperText>
                </>
            )}
        />
    </FormControl>
);
