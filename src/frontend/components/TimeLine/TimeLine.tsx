import React from "react";
import { useSelector } from "src/src/frontend/globalState";
import { Tweet } from "src/frontend/components";

export const TimeLine: React.FC = React.memo((_props) => {
  const isLoading = useSelector((state) => state.isLoadingTweets);
  const tweets = useSelector((state) => state.tweets);
  return (
    <div>
      {isLoading && "Loading..."}
      {tweets.length > 0 && tweets.map((e, i) => <Tweet key={i} tweet={e} />)}
    </div>
  );
});
