import { loadConfigs } from "./config";
import { loadOldTweets } from "./tweets";

export const initialize = async () => {
  const config = await loadConfigs();
  if (config == null) throw new Error("last data of config does not exist");
  const oldTweetsArray = await Promise.all(
    config.listIds.map((listId) =>
      loadOldTweets(config.lastTweetIdGroup[listId], listId),
    ),
  );
  const oldTweetGroup = config.listIds.reduce((a, listId, i) => {
    // eslint-disable-next-line no-param-reassign
    a[listId] = oldTweetsArray[i];
    return a;
  }, {} as Record<string, Tweet[]>);
  return { ...config, tweetGroup: oldTweetGroup };
};
