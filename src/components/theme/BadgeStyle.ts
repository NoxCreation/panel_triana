import { ComponentStyleConfig, StyleFunctionProps } from "@chakra-ui/react";

const BadgeStyle: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "full",
    paddingX: "12px",
    lineHeight: "22px"
  },

  sizes: {},

  variants: {
    primary: (props: StyleFunctionProps) => ({
      borderRadius: "full",
      bg: props.colorScheme ? props.colorScheme : 'primary.600',
      color: 'white',
    })
  },

  defaultProps: {
    variant: "primary",
    colorScheme: "primary.600",
  },
};

export default BadgeStyle;
