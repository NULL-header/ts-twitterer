import React from "react";
import { useUpdate } from "src/frontend/globalState";

export const UpdateButton: React.FC = React.memo((_props) => {
  const dispatch = useUpdate();
  const getTweets = React.useCallback(() => {
    dispatch({ type: "GET_TWEETS" });
  }, [dispatch]);
  const showTweets = React.useCallback(() => {
    dispatch({ type: "LOAD_NEW_TWEETS" });
  }, [dispatch]);
  const deleteTweet = React.useCallback(() => {
    dispatch({ type: "DELETE_CACHE_TWEETS" });
  }, [dispatch]);
  const updateTweet = React.useCallback(() => {
    dispatch({ type: "UPDATE_TWEETS", dispatch });
  }, [dispatch]);
  return (
    <div>
      <button onClick={getTweets}>get tweets</button>
      <button onClick={showTweets}>show tweets</button>
      <button onClick={updateTweet}>update tweets</button>
      <button onClick={deleteTweet}>delete tweets</button>
    </div>
  );
});
