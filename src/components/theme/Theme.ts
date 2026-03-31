import { ThemeConfig, extendTheme } from "@chakra-ui/react";
import InputStyle from "./InputStyle";
import TextareaStyle from './TextareaStyle';
import ButtonStyle from "./ButtonStyle";
import BadgeStyle from "./BadgeStyle";
import AlertStyle from "./AlertStyle";
import CardStyle from "./CardStyle";
import SelectStyle from "./SelectStyle";
import FormLabelStyle from "./FormLabelStyle";
import CheckboxStyle from "./CheckboxStyle";

const VoyPatiTheme: ThemeConfig = extendTheme({
  fonts: {
    /* body: "Lato, sans-serif",
    heading: "Lato, sans-serif", */
  },
  colors: {
    primary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef', 
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e',
    }
  },
  components: {
    Input: InputStyle,
    Select: SelectStyle,
    Textarea: TextareaStyle,
    Button: ButtonStyle,
    FormLabel: FormLabelStyle,
    Badge: BadgeStyle,
    Alert: AlertStyle,
    Card: CardStyle,
    Checkbox: CheckboxStyle,
    Heading: {
      sizes: {
        md: {
          fontSize: "15px",
        },
        xs: {
          fontSize: "10px",
        },
      },
    }
  },
  styles: {
    global: {
      // styles for the `body`
    }
  },
});

export default VoyPatiTheme;

