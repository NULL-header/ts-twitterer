import React from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { Provider } from "./globalState";
import { LoadContainer, EffectContainer } from "./components";
import { theme } from "./theme";

export const App = () => (
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <Provider>
      <ChakraProvider theme={theme} resetCSS>
        <EffectContainer>
          <LoadContainer />
        </EffectContainer>
      </ChakraProvider>
    </Provider>
  </>
);
