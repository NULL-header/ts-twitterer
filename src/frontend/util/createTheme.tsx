import React, { createContext } from "react";
import { createTheming } from "react-jss";

import { createMakeStyles } from "./createMakeStyles";

export const createTheme = <Theme, ThemeNames extends string>(
  themes: Record<ThemeNames, Theme>,
) => {
  const ThemeContext = createContext({} as Theme);
  const Theming = createTheming(ThemeContext);
  const makeStyles = createMakeStyles(Theming);
  const ThemeProvider: React.FC<{
    themeName: ThemeNames;
    children: React.ReactElement;
  }> = React.memo((props) => {
    const theme = themes[props.themeName];
    return (
      <Theming.ThemeProvider theme={theme as any}>
        {props.children}
      </Theming.ThemeProvider>
    );
  });
  return { ThemeProvider, makeStyles, Theming };
};
