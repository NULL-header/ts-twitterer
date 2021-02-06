import { db } from "../db";
import Dexie from "dexie";
import { makeTweets } from "./makeTweets";

export const loadNewTweets = async (
  lastTweetId: number,
  listId: string
): Promise<Tweet[]> => {
  const newTweetLows = await db.tweets
    .where("[id+list_id]")
    .between([lastTweetId + 1, listId], [Dexie.maxKey, listId])
    .toArray();
  console.log("load new tweets");
  console.log({ newTweetLows });
  if (newTweetLows.length === 0) return [];
  return makeTweets(newTweetLows);
};

export const loadOldTweets = async (
  lastTweetId: number,
  listId: string
): Promise<Tweet[]> => {
  const newTweetLows = await db.tweets
    .where("[id+list_id]")
    .between([Dexie.minKey, listId], [lastTweetId + 1, listId])
    .toArray();
  if (newTweetLows.length === 0) return [];
  return makeTweets(newTweetLows);
};
