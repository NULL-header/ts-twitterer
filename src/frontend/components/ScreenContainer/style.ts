import { makeStyles } from "frontend/theme";

export const useStyles = makeStyles()((theme) => ({
  "@global": {
    body: {
      backgroundColor: theme.color.secondary,
      margin: 0,
    },
    h2: {
      margin: 0,
    },
  },
  root: {
    display: "flex",
  },
}));
