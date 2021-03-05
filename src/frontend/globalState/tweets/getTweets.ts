/* eslint-disable @typescript-eslint/naming-convention */
import { CONSTVALUE } from "frontend/CONSTVALUE";
import { db } from "frontend/db";
import update from "immutability-helper";
import { State } from "../types";
import {
  CurrentListInitError,
  DataIdMapInitError,
  ShouldUnupdateError,
} from "../errors";

const getTweetLows = async (lastNewestTweetDataId: string, listId: string) => {
  const tweetResponse = await fetch(
    `${CONSTVALUE.GET_TWEETS_URL}?last_newest_tweet_data_id=${lastNewestTweetDataId}&list_id_str=${listId}`,
  );
  console.log({ tweetResponse });
  return (await tweetResponse.json()) as TweetColumns[];
};

const throwErrorToWrongValue = (
  isGettingTweets: boolean,
  remaining: number,
) => {
  if (remaining < CONSTVALUE.LATE_LIMIT)
    throw new Error("the remaining is too few");
  else if (isGettingTweets)
    throw new Error("it is not needed because it will do by old task");
};

const manageDataId = (dataMap: Configs["newestTweetDataIdMap"]) => {
  const spec = [] as [string, string][];
  const get = (listId: string) => {
    const dataid = dataMap.get(listId);
    if (dataid == null) throw new DataIdMapInitError({ key: { listId } });
    return dataid;
  };
  const addDataId = ({
    listId,
    dataid,
  }: {
    listId: string;
    dataid: string;
  }) => {
    spec.push([listId, dataid]);
  };
  const makeNewMap = () => update(dataMap, { $add: spec });
  return { get, addDataId, makeNewMap };
};

type DataIdManager = ReturnType<typeof manageDataId>;

const getTweetLowsArray = (listIds: string[], manager: DataIdManager) =>
  Promise.all(
    listIds.map((listId) => {
      const dataid = manager.get(listId);
      return getTweetLows(dataid, listId);
    }),
  );

const writeTweetLows = (tweetLowsArray: any[][]) => {
  const tweetLows = tweetLowsArray.flat();
  return db.tweets.bulkAdd(tweetLows as any);
};

const makeNewTweetLows = (tweetLowsArray: any[][], manager: DataIdManager) =>
  tweetLowsArray.filter((e) => {
    const isNew = e.length !== 0;
    if (isNew) {
      const { dataid, list_id } = e[0];
      manager.addDataId({ dataid, listId: list_id });
    }
    return isNew;
  });

export const getTweets = async (getState: () => State) => {
  const {
    isGettingTweets,
    listIds,
    newestTweetDataIdMap,
    limitData: {
      lists: { remaining },
    },
  } = getState();
  throwErrorToWrongValue(isGettingTweets, remaining);
  const manager = manageDataId(newestTweetDataIdMap);
  const tweetLowsArray = await getTweetLowsArray(listIds, manager);
  const newTweetLowsArray = makeNewTweetLows(tweetLowsArray, manager);
  if (newTweetLowsArray.length === 0) throw new ShouldUnupdateError();
  const writingPromise = writeTweetLows(tweetLowsArray);
  const newMap = manager.makeNewMap();
  await writingPromise;
  return {
    newestTweetDataIdMap: newMap,
  } as State;
};

export const getTweetFromSingleList = async (getState: () => State) => {
  const {
    newestTweetDataIdMap,
    isGettingTweets,
    currentList,
    limitData: {
      lists: { remaining },
    },
  } = getState();
  throwErrorToWrongValue(isGettingTweets, remaining);
  if (currentList == null) throw new CurrentListInitError();
  const manager = manageDataId(newestTweetDataIdMap);
  const tweetLows = await getTweetLows(manager.get(currentList), currentList);
  if (tweetLows.length === 0) throw new ShouldUnupdateError();
  const writingPromise = db.tweets.bulkAdd(tweetLows as any);
  manager.addDataId({
    listId: currentList,
    dataid: tweetLows[tweetLows.length - 1].dataid,
  });
  const newMap = manager.makeNewMap();
  await writingPromise;
  return { newestTweetDataIdMap: newMap } as State;
};
