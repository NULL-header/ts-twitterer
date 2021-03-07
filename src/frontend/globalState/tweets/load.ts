import Dexie from "dexie";
import { db } from "../../db";
import { makeTweets } from "./makeTweets";
import { State } from "../types";

const loadNewTweetsFromDB = async (
  lastTweetId: number,
  listId: string,
): Promise<Tweet[]> => {
  const newTweets = await db.tweets
    .where("[id+list_id]")
    .between([lastTweetId + 1, listId], [Dexie.maxKey, listId])
    .toArray(makeTweets);
  return newTweets;
};

export const loadNewTweets = async (getState: () => State) => {
  const { lastTweetId: oldLastTweetId, currentList, tweets } = getState();
  if (currentList == null) throw new Error("current list is undefined");
  const newTweets = await loadNewTweetsFromDB(oldLastTweetId, currentList);
  if (newTweets.length === 0) throw new Error("new tweets do not exist");
  const lastTweetId = newTweets[newTweets.length - 1].id;
  return { tweets: [...tweets, ...newTweets], lastTweetId };
};

export const loadOldTweets = async (
  lastTweetId: number,
  listId: string,
): Promise<Tweet[]> => {
  console.log({ listId, minkey: Dexie.minKey });
  const newTweets = await db.tweets
    .where("[id+list_id]")
    .between([Dexie.minKey, listId], [lastTweetId + 1, listId])
    .toArray(makeTweets);
  return newTweets;
};
