import { ComponentStyleConfig } from '@chakra-ui/react'

const CardStyle: ComponentStyleConfig = {
  baseStyle: {
    container: {
      borderRadius: 'md',            // usa token en lugar de valor fijo
      p: 4,                          // padding uniforme (16px)
      transition: 'all 0.2s',        // suavidad para posibles interacciones
    },
    header: {
      px: 4,                         // padding horizontal consistente
      pt: 3,                         // padding top (12px)
      pb: 2,                         // padding bottom (8px)
      fontWeight: 'medium',
    },
  },
  variants: {
    primary: (props) => {
      const { colorMode } = props
      const isLight = colorMode === 'light'

      return {
        container: {
          bg: isLight ? 'white' : 'gray.700',
          borderWidth: '1px',
          borderColor: isLight ? 'gray.200' : 'gray.600', // adaptativo
          boxShadow: isLight
            ? '0 5px 15px rgba(115, 115, 155, 0.05)'
            : '0 5px 15px rgba(0, 0, 0, 0.3)',          // sombra adaptativa
        },
        header: {
          color: isLight ? 'gray.700' : 'gray.50',
        },
        // Puedes agregar estilos para body, footer si tu componente los usa
        body: {
          px: 2,
          py: 2,
        },
        footer: {
          px: 4,
          pb: 3,
          pt: 2,
          borderTopWidth: '1px',
          borderColor: isLight ? 'gray.200' : 'gray.600',
        },
      }
    },
    table: (props) => {
      const { colorMode } = props
      const isLight = colorMode === 'light'

      return {
        container: {
          p: 0,
          bg: isLight ? 'white' : 'gray.700',
          borderWidth: '1px',
          borderColor: isLight ? 'gray.200' : 'gray.600', // adaptativo
          boxShadow: isLight
            ? '0 5px 15px rgba(115, 115, 155, 0.05)'
            : '0 5px 15px rgba(0, 0, 0, 0.3)',          // sombra adaptativa
        },
        header: {
          px: 6,
          pt: 6,
          color: isLight ? 'gray.700' : 'gray.50',
        },
        // Puedes agregar estilos para body, footer si tu componente los usa
        body: {
          px: 0,
          py: 4,
        },
        footer: {
          px: 4,
          pb: 3,
          pt: 2,
          borderTopWidth: '1px',
          borderColor: isLight ? 'gray.200' : 'gray.600',
        },
      }
    },
  },
  defaultProps: {
    variant: 'primary',
  },
}

export default CardStyle