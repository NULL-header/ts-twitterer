import React from "react";
import { useTracked } from "src/frontend/globalState";
import { Tweet } from "../Tweet";
import { useStyles } from "./style";

export const TimeLine: React.FC = React.memo(() => {
  const [state] = useTracked();
  const { currentList, tweetGroup } = state;
  console.log({ tweetGroup, currentList });
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {currentList == null
        ? undefined
        : tweetGroup[currentList].map((e) => (
            <Tweet key={e.dataid} tweet={e} />
          ))}
    </div>
  );
});
