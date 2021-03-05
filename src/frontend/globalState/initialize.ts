import { loadConfigs } from "./config";
import { loadOldTweets } from "./tweets";
import { ConfigInitError } from "./errors";
import { State } from "./types";

export const initialize = async () => {
  const config = await loadConfigs();
  if (config == null) throw new ConfigInitError();
  const { currentList, lastTweetId } = config;
  if (currentList == null) return config;
  const oldTweets = await loadOldTweets(lastTweetId, currentList);
  return { ...config, tweets: oldTweets } as State;
};
