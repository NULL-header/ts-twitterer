/* eslint-disable @typescript-eslint/naming-convention */
import { State } from "frontend/globalState/types";
import {
  DuplicateError,
  RateError,
  ShouldUnupdateError,
  CurrentListInitError,
  NewestDataIdMapError,
} from "frontend/globalState/errors";
import { CONSTVALUE } from "frontend/CONSTVALUE";
import { Work } from "./types";
import { db } from "./db";

const throwErrorToWrongValue = (
  isGettingTweets: boolean,
  limitData: LimitData | undefined,
) => {
  if (limitData != null && limitData.lists != null) {
    const {
      lists: { remaining },
    } = limitData;
    if (remaining < CONSTVALUE.LATE_LIMIT)
      throw new RateError({ limit: { remaining } });
  } else if (isGettingTweets)
    throw new DuplicateError({ flag: { isGettingTweets } });
};

const getTweetLows = async (lastNewestTweetDataId: string, listId: string) => {
  const tweetResponse = await fetch(
    `${CONSTVALUE.GET_TWEETS_URL}?last_newest_tweet_data_id=${lastNewestTweetDataId}&list_id_str=${listId}`,
  );
  return (await tweetResponse.json()) as TweetColumns[];
};

const getTweetLowsArray = (
  listIds: string[],
  dataIdMap: State["newestTweetDataIdMap"],
) =>
  Promise.all(
    listIds.map((listId) => {
      const dataid = dataIdMap.get(listId);
      if (dataid == null) throw new NewestDataIdMapError({ key: { listId } });
      return getTweetLows(dataid, listId);
    }),
  );

const writeTweetLows = (tweetLowsArray: any[][]) => {
  const tweetLows = tweetLowsArray.flat();
  return db.tweets.bulkAdd(tweetLows as any);
};

const makeNewTweetLows = (
  tweetLowsArray: any[][],
  dataIdMap: State["newestTweetDataIdMap"],
) =>
  tweetLowsArray.filter((e) => {
    const isNew = e.length !== 0;
    if (isNew) {
      const { dataid, list_id } = e[0];
      dataIdMap.set(list_id, dataid);
    }
    return isNew;
  });

export const saveTweets = async ({
  isGettingTweets,
  listIds,
  newestTweetDataIdMap,
  limitData,
}: State) => {
  throwErrorToWrongValue(isGettingTweets, limitData);
  const tweetLowsArray = await getTweetLowsArray(listIds, newestTweetDataIdMap);
  const newTweetLowsArray = makeNewTweetLows(
    tweetLowsArray,
    newestTweetDataIdMap,
  );
  if (newTweetLowsArray.length === 0) throw new ShouldUnupdateError();
  await writeTweetLows(tweetLowsArray);
  return { newestTweetDataIdMap };
};

export const saveTweetFromSingleList: Work = async ({
  newestTweetDataIdMap,
  isGettingTweets,
  currentList,
  limitData,
}) => {
  throwErrorToWrongValue(isGettingTweets, limitData);
  if (currentList == null) throw new CurrentListInitError();
  const dataid = newestTweetDataIdMap.get(currentList) || "0";
  const tweetLows = await getTweetLows(dataid, currentList);
  if (tweetLows.length === 0) throw new ShouldUnupdateError();
  const writingPromise = db.tweets.bulkAdd(tweetLows as any);
  newestTweetDataIdMap.set(
    currentList,
    tweetLows[tweetLows.length - 1].tweet.dataid,
  );
  await writingPromise;
  return { newestTweetDataIdMap } as State;
};
