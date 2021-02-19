import React from "react";
import { useTracked } from "src/frontend/globalState";
import { Tweet } from "../Tweet";
import { useStyles } from "./style";

export const TimeLine: React.FC = React.memo(() => {
  const [state] = useTracked();
  const { isLoadingTweets, currentList, tweetGroup } = state;
  const tweets = React.useMemo(
    () =>
      tweetGroup[currentList].map((e) => <Tweet key={e.dataid} tweet={e} />),
    [tweetGroup, currentList],
  );
  console.log({ tweets, tweetGroup, currentList });
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {isLoadingTweets && "Loading..."}
      {tweets.length > 0 && tweets}
    </div>
  );
});
