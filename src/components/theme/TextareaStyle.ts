import { ComponentStyleConfig, StyleFunctionProps } from "@chakra-ui/react";

const TextareaStyle: ComponentStyleConfig = {
    baseStyle: {
        backgroundColor: "white",

    },

    sizes: {},

    variants: {
        primary: (props: StyleFunctionProps) => ({
            fontSize: "14px",
            bg: props.colorMode === "dark" ? "gray.700" : "white",
            borderRadius: "8px",
            padding: "8px",
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: props.colorMode === "dark" ? "gray.600" : "gray.200",
            boxShadow: "none",
            transition: "box-shadow .1s ease, border-color .3s ease",
            _placeholder: {
                color: props.colorMode == "dark" ? "#a2a5a5" : "#73777B",
            },
            _hover: {
                borderColor: "primary.200",
            },
            _focus: {
                boxShadow: "0px 0px 1px 3px #ffe1a5",
                border: "primary.200",
            },
            _invalid: {
                borderColor: "red.500",
                boxShadow: "0 0 0 1px red.500",
            },
        }),
    },

    defaultProps: {
        variant: 'primary'
    },
};

export default TextareaStyle;
