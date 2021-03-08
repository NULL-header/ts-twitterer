import { ConfigInitError } from "frontend/globalState/errors";
import { State } from "frontend/globalState/types";
import Dexie from "dexie";
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

const loadConfigs = async () => {
  const dataNullable = await db.configs.get(0);
  if (dataNullable == null) throw new ConfigInitError();
  return dataNullable.last_data;
};

const loadOldTweets = (lastTweetId: number, listId: string) =>
  db.tweets
    .where("[id+list_id]")
    .between([Dexie.minKey, listId], [lastTweetId + 1, listId])
    .toArray(makeTweets);

export const initialize = async () => {
  const lastData = (await loadConfigs()) as Configs & Pick<State, "tweets">;
  const { currentList, lastTweetId } = lastData;
  if (currentList == null) return lastData as State;
  const oldTweets = await loadOldTweets(lastTweetId, currentList);
  lastData.tweets = oldTweets;
  return lastData as State;
};
