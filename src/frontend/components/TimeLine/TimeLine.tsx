import React from "react";
import { useSelector } from "src/src/frontend/globalState";
import { Tweet } from "src/frontend/components";
import { useStyles } from "./style";

export const TimeLine: React.FC = React.memo((_props) => {
  const isLoading = useSelector((state) => state.isLoadingTweets);
  const currentList = useSelector((state) => state.currentList);
  const tweetGroup = useSelector((state) => state.tweetGroup);
  const tweets = tweetGroup[currentList];
  console.log({ tweets, tweetGroup, currentList });
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {isLoading && "Loading..."}
      {tweets != null &&
        tweets.length > 0 &&
        tweets.map((e, i) => <Tweet key={i} tweet={e} />)}
    </div>
  );
});
