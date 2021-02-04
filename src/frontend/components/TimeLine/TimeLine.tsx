import React from "react";
import { useSelector } from "src/src/frontend/globalState";
import { Tweet } from "src/frontend/components";
import { useStyles } from "./style";

export const TimeLine: React.FC = React.memo((_props) => {
  const isLoading = useSelector((state) => state.isLoadingTweets);
  const tweets = useSelector((state) => state.tweets);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {isLoading && "Loading..."}
      {tweets.length > 0 && tweets.map((e, i) => <Tweet key={i} tweet={e} />)}
    </div>
  );
});
