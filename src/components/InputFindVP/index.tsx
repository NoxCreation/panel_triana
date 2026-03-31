import { useEffect, useState, useCallback } from "react";
import { AsyncSelect, components } from 'chakra-react-select';
import { Flex, IconButton, Text, useColorMode, Stack, Progress, FormControl, FormLabel, Box, FormHelperText, InputProps, Img } from "@chakra-ui/react";
import { FiSearch, FiX } from "react-icons/fi";
import { Control, Controller } from "react-hook-form";

type Props = {
    placeholder?: string,
    name: string;
    label: string;
    rules?: any;
    control?: Control<any>;
    isRequired?: boolean,
    isDisabled?: boolean
    sizeControl?: 'sm' | 'md'
    styles?: any
    value?: string
    onFind: (search: string) => Promise<{ label: string; value: string; image?: string }[]> | { label: string; value: any; image?: string }[],
    onChange: (option: any, index?: number) => void;
    onClean?: () => void
} & InputProps

export const InputFindVP = ({
    placeholder = "Find ...",
    name,
    label,
    rules,
    control,
    isRequired,
    isDisabled,
    sizeControl = 'sm',
    styles,
    value,
    onFind,
    onChange,
    onClean,
}: Props) => {
    const [inputValue, setInputValue] = useState<any>(undefined);
    const { colorMode } = useColorMode();
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    const fetchOptions = useCallback((inputValue: string, callback: (options: any[]) => void) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        const newTimer = setTimeout(async () => {
            const options = await onFind(inputValue);
            callback(options);
        }, 500); // 500ms de delay

        setDebounceTimer(newTimer);
    }, [debounceTimer, onFind]);

    useEffect(() => {
        return () => {
            if (debounceTimer) {
                clearTimeout(debounceTimer);
            }
        };
    }, [debounceTimer]);

    useEffect(() => {
        if (value == undefined)
            setInputValue(undefined)
    }, [value])

    const DropdownIndicator = (props: any) => {
        return (
            <components.DropdownIndicator {...props}>
                {inputValue != undefined ? (
                    <IconButton size={'xs'} variant={'ghost'} aria-label="" icon={<FiX />} onClick={() => {
                        setInputValue(undefined)
                        if (onClean) {
                            onClean()
                        }
                    }} />
                ) : (
                    <IconButton size={'xs'} variant={'ghost'} aria-label="" icon={<FiSearch />} isDisabled />
                )}
            </components.DropdownIndicator>
        );
    };

    const CustomOption = (props: any) => {
        return (
            <components.Option {...props}>
                <Flex alignItems="center" zIndex={9} gap={2}>
                    {props.data.image && <Box w={'50px !important'} h={'50px !important'}>
                        <Img src={props.data.image} w={'50px !important'} h={'50px !important'} />
                    </Box>}
                    <Text color={colorMode === 'dark' ? 'gray.200' : 'gray.700'}>{props.data.label}</Text>
                </Flex>
            </components.Option>
        );
    };

    return (
        <FormControl>
            {label != '' && <FormLabel>{label} {isRequired && <Box as="span" color={'red'}>*</Box>}</FormLabel>}
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <AsyncSelect
                            {...field}
                            loadOptions={fetchOptions}
                            value={inputValue}
                            onChange={(option) => {
                                if (option) {
                                    onChange(option.value, option.index);
                                    setInputValue(option);
                                } else {
                                    setInputValue(undefined);
                                    onChange(undefined);
                                }
                            }}
                            placeholder={placeholder}
                            loadingMessage={() => (
                                <Stack px={5} bg={'white'}>
                                    <Progress colorScheme='primary' size='xs' value={20} isIndeterminate />
                                    <Text fontSize={'12px'}>Searching for matches</Text>
                                </Stack>
                            )}
                            noOptionsMessage={() => "No results"}
                            components={{ DropdownIndicator, Option: CustomOption }}
                            isDisabled={isDisabled}
                            chakraStyles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: '100%',
                                    borderRadius: "8px"
                                }),
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: colorMode === 'dark' ? 'gray.700' : 'white',
                                    borderColor: colorMode === 'dark' ? 'gray.600' : 'gray.200',
                                    paddingTop: '0px',
                                    paddingBottom: '0px',
                                    minHeight: '40px',
                                    height: sizeControl == 'sm' ? "32px" : '40px',
                                    alignContent: 'center',
                                    ...styles
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    backgroundColor: colorMode === 'dark' ? 'gray.800' : 'white'
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isSelected ? (colorMode === 'dark' ? 'gray.700' : 'gray.100') : (colorMode === 'dark' ? 'gray.800' : 'white'),
                                    color: colorMode === 'dark' ? 'gray.200' : 'gray.700',
                                    '&:hover': {
                                        backgroundColor: colorMode === 'dark' ? 'red.600' : 'gray.200',
                                    }
                                }),
                            }}
                        />
                        {error && <FormHelperText>
                            {error.message}
                        </FormHelperText>}
                    </>
                )}
            />
        </FormControl>
    );
};