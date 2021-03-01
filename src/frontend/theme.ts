import { extendTheme } from "@chakra-ui/react";

const globalPseudo = {
  "&": {
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
};

export const theme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: true },
  styles: {
    global: {
      "*": {
        ...globalPseudo,
      },
    },
  },
});
