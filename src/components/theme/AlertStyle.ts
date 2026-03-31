import { ComponentStyleConfig } from '@chakra-ui/react'

const AlertStyle: ComponentStyleConfig = {
  baseStyle: () => ({}),

  variants: {
    success: {
      container: {
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "green.400",
        backgroundColor: "green.100",
        padding: "16px",
      },
      title: {
        color: "green.700",
      },
      description: {
        color: "green.700",
      },
      icon: {
        color: "green.700",
      },
      spinner: {
        color: "green.700",
      },
    },
    error: {
      container: {
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "red.400",
        backgroundColor: "red.100",
        padding: "16px",
      },
      title: {
        color: "red.700",
      },
      description: {
        color: "red.700",
      },
      icon: {
        color: "red.700",
      },
      spinner: {
        color: "red.700",
      },
    },
    warning: {
      container: {
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "yellow.400",
        backgroundColor: "yellow.100",
        padding: "16px",
      },
      title: {
        color: "yellow.700",
      },
      description: {
        color: "yellow.700",
      },
      icon: {
        color: "yellow.700",
      },
      spinner: {
        color: "yellow.700",
      },
    },
    info: {
      container: {
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "info.200",
        backgroundColor: "info.200",
        padding: "16px",
        color: "white",
      },
      title: {
        color: "white",
      },
      description: {
        color: "white",
      },
      icon: {
        color: "white",
      },
      spinner: {
        color: "white",
      },
    },
  },

  defaultProps: {
    variant: 'success',
  },
}

export default AlertStyle
