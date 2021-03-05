import { State } from "./types";
import { db } from "../db";

const makeEmptyData = (dataIdGroup: Configs["newestTweetDataIdMap"]) => {
  const lastTweetId = 0;
  const tweets = [] as Tweet[];
  const newestTweetDataIdMap = new Map() as Configs["newestTweetDataIdMap"];
  dataIdGroup.forEach((_, key) => {
    newestTweetDataIdMap.set(key, "0");
  });
  return { lastTweetId, tweets, newestTweetDataIdMap };
};

export const deleteCacheTweets = async (getState: () => State) => {
  const promise = db.tweets.clear();
  const { newestTweetDataIdMap: dataidMap } = getState();
  const { lastTweetId, tweets, newestTweetDataIdMap } = makeEmptyData(
    dataidMap,
  );
  await promise;
  return { tweets, lastTweetId, newestTweetDataIdMap };
};

export const deleteCacheConfig = async () => {
  const promise = db.configs.clear();
  const initValue = {
    currentList: "",
    limitData: { lists: { limitRate: 0, remaining: 0 } },
    listIds: [] as string[],
    lastTweetId: 0,
    newestTweetDataIdMap: new Map(),
  } as Configs;
  await promise;
  return initValue;
};
