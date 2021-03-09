import { State } from "frontend/globalState/types";
import { db } from "./db";

export const deleteCacheConfig = async () => {
  const promise = db.configs.clear();
  const initValue = {
    currentList: undefined,
    limitData: undefined,
    listIds: [] as string[],
    tweets: [] as Tweet[],
    newestTweetDataIdMap: new Map(),
    newestUniqIdMap: new Map(),
    oldestUniqIdMap: new Map(),
  } as State;
  await promise;
  return initValue;
};

export const deleteCacheTweetsAll = async () => {
  const promise = db.tweets.clear();
  await promise;
  return {
    newestTweetDataIdMap: new Map(),
    newestUniqIdMap: new Map(),
    oldestUniqIdMap: new Map(),
    tweets: [] as Tweet[],
  } as State;
};
