import update from "immutability-helper";
import { CONSTVALUE } from "frontend/CONSTVALUE";
import { State } from "../types";
import { db } from "../../db";

const findNewDifference = async (tweetLowsArray: TweetColumns[][]) => {
  const indicesNewTweet = tweetLowsArray.reduce((a, e, i) => {
    if (e.length !== 0) a.push(i);
    return a;
  }, [] as number[]);
  if (indicesNewTweet.length === 0) throw new Error("new tweet is nothing");
  const tweetLows = tweetLowsArray.flat();
  console.log({ tweetLows });
  await db.tweets.bulkAdd(tweetLows as any);
  return indicesNewTweet;
};

const getTweetLows = async (lastNewestTweetDataId: string, listId: string) => {
  const tweetResponse = await fetch(
    `${CONSTVALUE.GET_TWEETS_URL}?last_newest_tweet_data_id=${lastNewestTweetDataId}&list_id_str=${listId}`,
  );
  console.log({ tweetResponse });
  return (await tweetResponse.json()) as TweetColumns[];
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
  if (remaining < CONSTVALUE.LATE_LIMIT)
    throw new Error("the remaining is too few");
  else if (listIds.length === 0)
    throw new Error("there are nothing ids of lists");
  const tweetLowsArray = await Promise.all(
    listIds.map((listId) =>
      getTweetLows(lastNewestTweetDataIdGroup[listId], listId),
    ),
  );
  const indicesNewTweet = await findNewDifference(tweetLowsArray);
  const newSpecs = indicesNewTweet.reduce((a, index) => {
    const listId = listIds[index];
    const tweets = tweetLowsArray[index];
    // it is reduce
    // eslint-disable-next-line no-param-reassign
    a[listId] = { $set: tweets[tweets.length - 1].dataid };
    return a;
  }, {} as Record<string, { $set: string }>);
  return {
    newestTweetDataIdGroup: update(lastNewestTweetDataIdGroup, newSpecs),
  };
};
