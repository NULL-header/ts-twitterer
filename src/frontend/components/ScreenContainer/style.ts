import { makeStyles } from "src/frontend/theme";
export const useStyles = makeStyles()({
  "@global": {
    body: {
      backgroundColor: "grey",
      margin: 0,
    },
    h2: {
      margin: 0,
    },
  },
  root: {
    display: "flex",
  },
});
