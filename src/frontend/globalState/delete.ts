import { State } from "./types";
import { db } from "../db";

export const deleteCacheTweets = async (getState: () => State) => {
  const { listIds } = getState();
  const promise = db.tweets.clear();
  const {
    lastTweetIdGroup,
    newestTweetDataIdGroup,
    tweetGroup,
  } = listIds.reduce(
    (a, e) => {
      a.tweetGroup[e] = [];
      a.lastTweetIdGroup[e] = 0;
      a.newestTweetDataIdGroup[e] = "0";
      return a;
    },
    {
      tweetGroup: {},
      lastTweetIdGroup: {},
      newestTweetDataIdGroup: {},
    } as Pick<
      State,
      "tweetGroup" | "lastTweetIdGroup" | "newestTweetDataIdGroup"
    >
  );
  await promise;
  return { tweetGroup, lastTweetIdGroup, newestTweetDataIdGroup };
};

export const deleteCacheConfig = async () => {
  const promise = db.configs.clear();
  const initValue = {
    currentList: "",
    limitData: { lists: { limitRate: 0, remaining: 0 } },
    listIds: [] as string[],
    themename: "dark",
    lastTweetIdGroup: {},
    newestTweetDataIdGroup: {},
  } as Configs;
  await promise;
  return initValue;
};
