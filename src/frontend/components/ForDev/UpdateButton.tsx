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
  const writeConfig = React.useCallback(() => {
    dispatch({ type: "WRITE_CONFIG" });
  }, [dispatch]);
  const deleteConfig = React.useCallback(() => {
    dispatch({ type: "DELETE_CACHE_CONFIG" });
  }, [dispatch]);
  return (
    <div>
      <div>
        <button onClick={getTweets}>get tweets</button>
        <button onClick={showTweets}>show tweets</button>
        <button onClick={updateTweet}>update tweets</button>
        <button onClick={deleteTweet}>delete tweets</button>
      </div>
      <div>
        <button onClick={writeConfig}>write config</button>
        <button onClick={deleteConfig}>delete config</button>
      </div>
    </div>
  );
});
