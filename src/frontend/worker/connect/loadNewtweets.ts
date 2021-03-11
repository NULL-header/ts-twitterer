import { State } from "frontend/globalState/types";
import {
  CurrentListInitError,
  ShouldUnupdateError,
} from "frontend/globalState/errors";
import { Work } from "./types";
import { db } from "./db";

const loadTweetsFromDB = (
  oldestUniqId: number,
  listId: string,
  limit: number,
) =>
  db.tweets
    .where("tweet.listId")
    .equals(listId)
    .limit(limit)
    .filter((e) => e.tweet.uniqid > oldestUniqId)
    .toArray((e) => e.map((tweetData) => tweetData.tweet));

const loadTweetsAllFromDB = (listId: string, windowLength: number) =>
  db.tweets
    .where("tweet.listId")
    .equals(listId)
    .limit(windowLength)
    .toArray((e) => e.map((tweetData) => tweetData.tweet));

const makeNextTweets = (allTweets: Tweet[], windowLength: number) =>
  allTweets.length > windowLength
    ? allTweets.slice(allTweets.length - windowLength - 1)
    : allTweets;

export const loadNewTweets: Work = async ({
  oldestUniqIdMap,
  newestUniqIdMap,
  currentList,
  tweets,
  windowLength,
}) => {
  console.log(windowLength);
  if (currentList == null) throw new CurrentListInitError();
  const uniqid = newestUniqIdMap.get(currentList);
  let newTweets: Tweet[];
  console.log(uniqid);
  if (uniqid == null)
    newTweets = await loadTweetsAllFromDB(currentList, windowLength);
  else
    newTweets = await loadTweetsFromDB(uniqid, currentList, windowLength / 2);
  if (newTweets.length === 0) throw new ShouldUnupdateError();
  const nextTweets = makeNextTweets(tweets.concat(newTweets), windowLength);
  console.log(newTweets);
  const newUniqid = nextTweets[nextTweets.length - 1].uniqid;
  newestUniqIdMap.set(currentList, newUniqid);
  const oldUniqId = nextTweets[0].uniqid;
  oldestUniqIdMap.set(currentList, oldUniqId);
  return {
    tweets: nextTweets,
    oldestUniqIdMap,
    newestUniqIdMap,
  } as State;
};
