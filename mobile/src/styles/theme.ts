import { extendTheme } from "native-base";

export const THEME = extendTheme({
  colors: {
    gray: {
      950: "#09090A",
      900: "#121214",
      800: "#202024",
      600: "#323238",
      300: "#8D8D99",
      200: "#C4C4CC",
    },
    indigo: {
      200: "#D2DAFF"
    },
    green: {
      400: "#5DA451",
      500: "#047C3F",
    },
    red: {
      500: "#DB4437",
    },
    grayRed: {
      400: "#997C7C"
    },
    white: "#FFFFFF",
  },
  fonts: {
    heading: "Roboto_700Bold",
    body: "Roboto_400Regular",
    medium: "Roboto_500Medium",
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
  sizes: {
    14: 56,
    22: 87,
    24: 100,
    26: 110,
  },
});
