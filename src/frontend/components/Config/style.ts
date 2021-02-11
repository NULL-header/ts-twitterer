import { makeStyles } from "src/frontend/theme";
export const useStyles = makeStyles()((theme) => ({
  root: {
    borderStyle: "none solid",
    borderColor: theme.color.primary,
    padding: 10,
  },
  divider: {
    color: theme.color.primary,
  },
}));
