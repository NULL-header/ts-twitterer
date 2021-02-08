import { db } from "../db";
import Dexie from "dexie";
import { makeTweets } from "./makeTweets";

export const loadNewTweets = async (
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
