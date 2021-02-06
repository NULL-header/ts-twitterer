import { db } from "../db";
import Dexie from "dexie";
import { makeTweets } from "./makeTweets";

export const loadNewTweets = async (
  lastTweetId: number,
  listId: string
): Promise<Tweet[]> => {
  const newTweetLows = await db.tweets
    .where("[id+list_id]")
    // lastweetID may make dobule showing
    // if it occured, minus one lastTweetId
    .between([lastTweetId, listId], [Dexie.maxKey, listId])
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
    // lastweetID may make dobule showing
    // if it occured, minus one lastTweetId
    .between([Dexie.minKey, listId], [lastTweetId, listId])
    .toArray();
  if (newTweetLows.length === 0) return [];
  return makeTweets(newTweetLows);
};
