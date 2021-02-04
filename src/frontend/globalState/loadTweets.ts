import { db } from "../db";
import { makeTweets } from "./makeTweets";

export const loadNewTweets = async (lastTweetId: number): Promise<Tweet[]> => {
  const newTweetLows = await db.tweets.where("id").above(lastTweetId).toArray();
  if (newTweetLows.length === 0) return [];
  return makeTweets(newTweetLows);
};

export const loadOldTweets = async (lastTweetId: number): Promise<Tweet[]> => {
  const newTweetLows = await db.tweets
    .where("id")
    .belowOrEqual(lastTweetId)
    .toArray();
  if (newTweetLows.length === 0) return [];
  return makeTweets(newTweetLows);
};
