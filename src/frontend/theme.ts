import { CSSProperties } from "react";
import { createTheme } from "./util";

interface Theme {
  color: {
    primary: CSSProperties["color"];
    secondary: CSSProperties["color"];
  };
}

const light: Theme = {
  color: {
    primary: "black",
    secondary: "white",
  },
};

const dark: Theme = {
  color: {
    primary: "lightgrey",
    secondary: "grey",
  },
};

export const themes = { light, dark };

export type themenames = keyof typeof themes;

export const { ThemeProvider, makeStyles } = createTheme(themes);
