import { CurrentListInitError, ShouldUnupdateError } from "frontend/errors";
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

export const loadNewTweets = async ({
  currentList,
  windowLength,
  newestUniqid,
}: {
  currentList: string | undefined;
  windowLength: number;
  newestUniqid: number | undefined;
}) => {
  if (currentList == null) throw new CurrentListInitError();
  let newTweets: Tweet[];
  if (newestUniqid == null)
    newTweets = await loadTweetsAllFromDB(currentList, windowLength);
  else
    newTweets = await loadTweetsFromDB(
      newestUniqid,
      currentList,
      windowLength / 2,
    );
  if (newTweets.length === 0) throw new ShouldUnupdateError();
  return newTweets;
};
