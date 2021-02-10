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
