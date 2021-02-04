import { CONSTVALUE } from "../CONSTVALUE";

export const getTweetLows = async (lastNewestTweetDataId: number) => {
  const tweetResponse = await fetch(
    CONSTVALUE.GET_TWEETS_URL +
      "?last_newest_tweet_data_id=" +
      lastNewestTweetDataId.toString
  );
  console.log({ tweetResponse });
  return (await tweetResponse.json()) as Tweet[];
};
