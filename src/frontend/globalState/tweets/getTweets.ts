import { CONSTVALUE } from "frontend/CONSTVALUE";
import { db } from "frontend/db";
import { mergeDeep } from "timm";
import { State } from "../types";

const findNewDifferences = async (tweetLowsArray: TweetColumns[][]) => {
  const indicesNewTweet = tweetLowsArray.reduce((a, e, i) => {
    // eslint-disable-next-line no-param-reassign
    if (e.length !== 0) a[a.length] = i;
    return a;
  }, [] as number[]);
  if (indicesNewTweet.length === 0) throw new Error("new tweet is nothing");
  const tweetLows = tweetLowsArray.flat();
  return { indicesNewTweet, tweetLows };
};

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

export const getTweets = async (getState: () => State) => {
  const {
    newestTweetDataIdGroup: lastNewestTweetDataIdGroup,
    isGettingTweets,
    listIds,
    limitData: {
      lists: { remaining },
    },
  } = getState();
  console.log({ lastNewestTweetDataIdGroup, isGettingTweets, listIds });
  throwErrorToWrongValue(isGettingTweets, remaining);
  if (listIds.length === 0) throw new Error("there are nothing ids of lists");
  const tweetLowsArray = await Promise.all(
    listIds.map((listId) =>
      getTweetLows(lastNewestTweetDataIdGroup[listId], listId),
    ),
  );
  const { indicesNewTweet, tweetLows } = await findNewDifferences(
    tweetLowsArray,
  );
  const writingPromise = db.tweets.bulkAdd(tweetLows as any);
  const newDataGroup = indicesNewTweet.reduce((a, index) => {
    const listId = listIds[index];
    const tweets = tweetLowsArray[index];
    // it is reduce
    // eslint-disable-next-line no-param-reassign
    a[listId] = tweets[tweets.length - 1].dataid;
    return a;
  }, {} as Record<string, string>);
  await writingPromise;
  return {
    newestTweetDataIdGroup: mergeDeep(
      lastNewestTweetDataIdGroup,
      newDataGroup,
    ) as Record<string, string>,
  };
};

export const updateTweets = async (getState: () => State) => {
  const {
    newestTweetDataIdGroup: lastNewestTweetDataIdGroup,
    isGettingTweets,
    currentList,
    limitData: {
      lists: { remaining },
    },
  } = getState();
  throwErrorToWrongValue(isGettingTweets, remaining);
  if (currentList == null) throw new Error("current list is undefined");
  const tweetLow = await getTweetLows(
    lastNewestTweetDataIdGroup[currentList],
    currentList,
  );
  if (tweetLow.length === 0) throw new Error("new tweet is nothing");
  const writingPromise = db.tweets.bulkAdd(tweetLow as any);
  const newestTweetDataIdGroup = mergeDeep(lastNewestTweetDataIdGroup, {
    [currentList]: tweetLow[tweetLow.length - 1].dataid,
  }) as Record<string, string>;
  console.log("newData", { newestTweetDataIdGroup });
  await writingPromise;
  return { newestTweetDataIdGroup };
};
