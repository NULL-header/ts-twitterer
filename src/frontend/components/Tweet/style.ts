import { makeStyles } from "src/frontend/theme";

export const useStyles = makeStyles()((theme) => ({
  root: {
    color: theme.color.primary,
    padding: 10,
    height: "100%",
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: theme.color.primary,
    borderBottomStyle: "none",
  },
  tweetContainer: {
    display: "grid",
    gridTemplateColumns: "60px 1fr",
    gridTemplateRows: "30px 30px 1fr",
    gridTemplateAreas: `
        "icon user"
        "icon content"
        ". content"
      `,
  },
  icon: {
    gridArea: "icon",
  },
  user: {
    gridArea: "user",
    display: "flex",
  },
  username: {
    gridArea: "username",
  },
  userid: {
    gridArea: "userid",
  },
  tweetContent: {
    gridArea: "content",
    whiteSpace: "pre-line",
  },
  media: {
    width: "100%",
  },
}));
