import { State } from "frontend/globalState/types";
import {
  CurrentListInitError,
  ShouldUnupdateError,
} from "frontend/globalState/errors";
import { Work } from "./types";
import { db } from "./db";

const loadTweetsFromDB = (oldestUniqId: number, listId: string) =>
  db.tweets
    .where("tweet.listId")
    .equals(listId)
    .filter((e) => e.tweet.uniqid > oldestUniqId)
    .toArray((e) => e.map((tweetData) => tweetData.tweet));

const loadTweetsAllFromDB = (listId: string) =>
  db.tweets
    .where("tweet.listId")
    .equals(listId)
    .toArray((e) => e.map((tweetData) => tweetData.tweet));

export const loadNewTweets: Work = async ({
  oldestUniqIdMap,
  currentList,
  tweets,
}) => {
  if (currentList == null) throw new CurrentListInitError();
  const uniqid = oldestUniqIdMap.get(currentList);
  let newTweets: Tweet[];
  if (uniqid == null) newTweets = await loadTweetsAllFromDB(currentList);
  else newTweets = await loadTweetsFromDB(uniqid, currentList);
  if (newTweets.length === 0) throw new ShouldUnupdateError();
  const newUniqid = newTweets[newTweets.length - 1].uniqid;
  oldestUniqIdMap.set(currentList, newUniqid);
  return { tweets: tweets.concat(newTweets), oldestUniqIdMap } as State;
};
