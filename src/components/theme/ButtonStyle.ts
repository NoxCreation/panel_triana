import { ComponentStyleConfig, StyleFunctionProps } from "@chakra-ui/react";

const ButtonStyle: ComponentStyleConfig = {
  baseStyle: {

  },

  sizes: {},

  variants: {
    primary: (props: StyleFunctionProps) => ({
      bgColor: props.colorScheme != 'gray' ? props.colorScheme : `primary.600`,
      color: "white",
      _hover: {
        filter: "brightness(0.95)",
        _disabled: {
          bgColor: props.colorMode == "dark" ? "primary.600" : "primary.400"
        }
      },
      borderRadius: '8px'
    }),
    ghost: (props: StyleFunctionProps) => ({
      bg: 'transparent',
      color: props.colorMode == "dark" ? `primary.600` : (props.colorScheme ? props.colorScheme : `primary.600`),
      _hover: {
        color: props.colorMode == "dark" ? `primary.200` : `primary.400`,
        bg: props.colorMode == "dark" ? 'primary.50' : 'primary.50'
      },
      _active: {
        color: props.colorMode == "dark" ? `primary.200` : `primary.400`,
        bg: props.colorMode == "dark" ? 'primary.100' : 'primary.100'
      },
      borderRadius: '8px'
    }),
    navoption: (props: StyleFunctionProps) => ({
      color: props.isActive ? "primary.600" : "gray.400",
      height: '45px',
      fontSize: '13px',
      _hover: {
        filter: "brightness(0.95)",
        bgColor: props.isActive ? "primary.100" : "gray.100"
      },
      borderRadius: 'full'
    }),
  },

  defaultProps: {
    variant: 'primary'
  },
};

export default ButtonStyle;
