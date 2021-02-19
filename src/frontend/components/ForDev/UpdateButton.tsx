import React from "react";
import { useUpdate } from "frontend/globalState";

export const UpdateButton: React.FC = React.memo(() => {
  const dispatch = useUpdate();
  const getTweets = React.useCallback(() => {
    dispatch({ type: "GET_TWEETS", dispatch });
  }, [dispatch]);
  const showTweets = React.useCallback(() => {
    dispatch({ type: "LOAD_NEW_TWEETS", dispatch });
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
        <button onClick={getTweets} type="button">
          get tweets
        </button>
        <button onClick={showTweets} type="button">
          show tweets
        </button>
        <button onClick={updateTweet} type="button">
          update tweets
        </button>
        <button onClick={deleteTweet} type="button">
          delete tweets
        </button>
      </div>
      <div>
        <button onClick={writeConfig} type="button">
          write config
        </button>
        <button onClick={deleteConfig} type="button">
          delete config
        </button>
      </div>
    </div>
  );
});
