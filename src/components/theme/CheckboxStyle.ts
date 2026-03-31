import { ComponentStyleConfig } from '@chakra-ui/react';

const CheckboxStyle: ComponentStyleConfig = {
  sizes: {
    sm: {
      control: {
        width: '16px',
        height: '16px',
      },
      label: {
        fontSize: '12px',
      },
    },
    md: {
      control: {
        width: '20px',
        height: '20px',
      },
      label: {
        fontSize: '16px',
      },
    },
    lg: {
      control: {
        width: '24px',
        height: '24px',
      },
      label: {
        fontSize: '20px',
      },
    },
  },
  variants: {
    primary: () => ({
      icon: {},
      control: {
        
      },
    }),
  },
  defaultProps: {
    variant: 'primary',
    colorScheme: 'primary',
    size: 'md', // Tamaño por defecto
  },
};

export default CheckboxStyle;
