import {
  CurrentListInitError,
  ShouldUnupdateError,
} from "frontend/globalState/errors";
import { TweetsDetailObj, TweetsDetail } from "frontend/models/TweetsDetail";
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
  tweetsDetailObj,
}: {
  currentList: string | undefined;
  tweetsDetailObj: TweetsDetailObj;
}) => {
  if (currentList == null) throw new CurrentListInitError();
  const tweetsDetail = new TweetsDetail().load(tweetsDetailObj);
  const { windowLength } = tweetsDetail;
  const uniqid = tweetsDetail.newestUniqidMap.get(currentList);
  let newTweets: Tweet[];
  if (uniqid == null)
    newTweets = await loadTweetsAllFromDB(currentList, windowLength);
  else
    newTweets = await loadTweetsFromDB(uniqid, currentList, windowLength / 2);
  if (newTweets.length === 0) throw new ShouldUnupdateError();
  const nextDetail = tweetsDetail.addTweets(newTweets);
  return nextDetail.toJS();
};
