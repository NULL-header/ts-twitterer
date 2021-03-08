import { State } from "frontend/globalState/types";
import { Work } from "./types";
import { db } from "./db";

export const deleteCacheConfig = async () => {
  const promise = db.configs.clear();
  const initValue = {
    currentList: "",
    limitData: { lists: { limitRate: 100, remaining: 100 } },
    listIds: [] as string[],
    lastTweetId: 0,
    newestTweetDataIdMap: new Map(),
  } as Configs;
  await promise;
  return initValue as State;
};

export const deleteCacheTweets: Work = async ({ listIds }) => {
  const promise = db.tweets.clear();
  const newDataMap = new Map(listIds.map((e) => [e, "0"]));
  await promise;
  return {
    newestTweetDataIdMap: newDataMap,
    lastTweetId: 0,
    tweets: [] as Tweet[],
  } as State;
};
