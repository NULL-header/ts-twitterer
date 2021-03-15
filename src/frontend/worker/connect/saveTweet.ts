/* eslint-disable @typescript-eslint/naming-convention */
import { RateError, ShouldUnupdateError } from "frontend/errors";
import { CONSTVALUE } from "frontend/CONSTVALUE";
import {
  TweetsDetail,
  TweetsDetailObj,
} from "frontend/components/main/Timeline/TweetsDetail";
import Immutable from "immutable";
import { db } from "./db";

const throwErrorToWrongValue = (limitData: LimitData | undefined) => {
  if (limitData != null && limitData.lists != null) {
    const {
      lists: { remaining },
    } = limitData;
    if (remaining < CONSTVALUE.LATE_LIMIT)
      throw new RateError({ limit: { remaining } });
  }
};

const getTweetLows = async (lastNewestTweetDataid: string, listId: string) => {
  const tweetResponse = await fetch(
    `${CONSTVALUE.GET_TWEETS_URL}?last_newest_tweet_data_id=${lastNewestTweetDataid}&list_id_str=${listId}`,
  );
  const result = (await tweetResponse.json()) as TweetColumns[];
  return result;
};

const getTweetLowsArray = (
  listIds: string[],
  newestDataidMap: TweetsDetail["newestDataidMap"],
) =>
  Promise.all(
    listIds.map((listId) => {
      const dataid = newestDataidMap.get(listId, "0");
      return getTweetLows(dataid, listId);
    }),
  );

const writeTweetLows = (tweetLowsArray: TweetColumns[][]) => {
  const tweetLows = tweetLowsArray.flat();
  return db.tweets.bulkAdd(tweetLows as any);
};

const checkIsNew = (
  tweetLowsArray: TweetColumns[][],
  newestDataidMap: TweetsDetail["newestDataidMap"],
) =>
  tweetLowsArray.reduce(
    (a, e) => {
      if (e.length === 0) return a;
      const { nextDataidMap, isNew } = a;
      const newestTweet = e[e.length - 1].tweet;
      return {
        nextDataidMap: nextDataidMap.set(
          newestTweet.listId,
          newestTweet.dataid,
        ),
        isNew: true || isNew,
      };
    },
    { nextDataidMap: newestDataidMap, isNew: false },
  );

export const saveTweets = async ({
  limitData,
  listIds,
  newestDataidMapObj,
}: {
  newestDataidMapObj: TweetsDetailObj["newestDataidMap"];
  listIds: string[];
  limitData: Configs["limitData"];
}) => {
  throwErrorToWrongValue(limitData);
  const newestDataidMap = Immutable.Map(newestDataidMapObj);
  const tweetLowsArray = await getTweetLowsArray(listIds, newestDataidMap);
  const { isNew, nextDataidMap } = checkIsNew(tweetLowsArray, newestDataidMap);
  if (!isNew) throw new ShouldUnupdateError();
  await writeTweetLows(tweetLowsArray);
  return nextDataidMap.toJS() as TweetsDetailObj["newestDataidMap"];
};
