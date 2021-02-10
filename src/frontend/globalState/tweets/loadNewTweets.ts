import { db } from "../../db";
import Dexie from "dexie";
import { makeTweets } from "./makeTweets";
import { State } from "../types";
import update from "immutability-helper";

export const loadNewTweetGroup = async (getState: () => State) => {
  const {
    listIds,
    lastTweetIdGroup: oldLastTweetIdGroup,
    tweetGroup: oldTweetGroup,
  } = getState();
  const tweetsArray = await loadNewTweetArray(listIds, oldLastTweetIdGroup);
  const indicesNewTweet = tweetsArray.reduce((a, e, i) => {
    if (e.length !== 0) a.push(i);
    return a;
  }, [] as number[]);
  if (indicesNewTweet.length === 0) throw new Error("new tweets do not exist");
  const newSpecs = indicesNewTweet.reduce(
    (a, index) => {
      const currentListId = listIds[index];
      const currentTweets = tweetsArray[index];
      a.tweetGroup[currentListId] = { $push: currentTweets };
      a.lastTweetIdGroup[currentListId] = {
        $set: currentTweets[currentTweets.length - 1].id,
      };
      return a;
    },
    { tweetGroup: {}, lastTweetIdGroup: {} } as {
      tweetGroup: Record<string, { $push: Tweet[] }>;
      lastTweetIdGroup: Record<string, { $set: number }>;
    }
  );
  const tweetGroup = update(oldTweetGroup, newSpecs.tweetGroup);
  const lastTweetIdGroup = update(
    oldLastTweetIdGroup,
    newSpecs.lastTweetIdGroup
  );
  return { tweetGroup, lastTweetIdGroup };
};

const loadNewTweetArray = async (
  listIds: string[],
  oldLastTweetIdGroup: Record<string, number>
) => {
  return await Promise.all(
    listIds.map((listId) => loadNewTweets(oldLastTweetIdGroup[listId], listId))
  );
};

const loadNewTweets = async (
  lastTweetId: number,
  listId: string
): Promise<Tweet[]> => {
  const newTweets = await db.tweets
    .where("[id+list_id]")
    .between([lastTweetId + 1, listId], [Dexie.maxKey, listId])
    .toArray(makeTweets);
  console.log("load new tweets");
  console.log({ newTweets });
  return newTweets;
};

export const loadOldTweets = async (
  lastTweetId: number,
  listId: string
): Promise<Tweet[]> => {
  const newTweets = await db.tweets
    .where("[id+list_id]")
    .between([Dexie.minKey, listId], [lastTweetId + 1, listId])
    .toArray(makeTweets);
  return newTweets;
};
