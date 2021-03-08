import Dexie from "dexie";
import { State } from "frontend/globalState/types";
import {
  CurrentListInitError,
  ShouldUnupdateError,
} from "frontend/globalState/errors";
import { Work } from "./types";
import { db } from "./db";

const extractData = (tweetColumns: TweetColumns): Tweet => {
  const {
    content,
    id,
    created_at: createdAt,
    icon_url: iconUrl,
    userid,
    dataid,
    username,
    list_id: listId,
    is_retweeted: isRetweeted,
    retweeter_name: retweeterName,
  } = tweetColumns;
  const tweet = {
    content,
    id,
    createdAt,
    iconUrl,
    userid,
    username,
    dataid,
    listId,
    isRetweeted,
    retweeterName,
  } as Tweet;
  return tweet;
};

const makeMedia = (mediaColumns?: MediaColumns) => {
  if (mediaColumns == null) return undefined;
  const { type: mediaType, media_url: mediaUrl } = mediaColumns;
  return { type: mediaType, mediaUrl } as Media;
};

const makeTweet = (tweetLow: any): Tweet => {
  const tweet = extractData(tweetLow);
  tweet.media = makeMedia(tweetLow.media);
  return tweet;
};

const makeTweets = (tweetLows: TweetColumns[]): Tweet[] =>
  tweetLows.map(makeTweet);

const loadTweetsFromDB = (lastTweetId: number, listId: string) =>
  db.tweets
    .where("[id+list_id]")
    .between([lastTweetId + 1, listId], [Dexie.maxKey, listId])
    .toArray(makeTweets);

export const loadNewTweets: Work = async ({
  lastTweetId: oldLastTweetId,
  currentList,
  tweets,
}) => {
  if (currentList == null) throw new CurrentListInitError();
  const newTweets = await loadTweetsFromDB(oldLastTweetId, currentList);
  if (newTweets.length === 0) throw new ShouldUnupdateError();
  const lastTweetId = newTweets[newTweets.length - 1].id;
  return { tweets: tweets.concat(newTweets), lastTweetId } as State;
};
