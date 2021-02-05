import { CONSTVALUE } from "../CONSTVALUE";

export const getTweetLows = async (
  lastNewestTweetDataId: string,
  listId: string
) => {
  const tweetResponse = await fetch(
    CONSTVALUE.GET_TWEETS_URL +
      "?last_newest_tweet_data_id=" +
      lastNewestTweetDataId +
      "&list_id_str=" +
      listId
  );
  console.log({ tweetResponse });
  return (await tweetResponse.json()) as Tweet[];
};
