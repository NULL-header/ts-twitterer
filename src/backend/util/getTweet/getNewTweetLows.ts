/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Twitter from "twitter";
import { makeTweetLow } from "./makeTweetLow";

export const getNewTweetData = (
  listId: string,
  client: Twitter,
): Promise<any[]> =>
  client.get("lists/statuses", {
    list_id: listId,
    include_rts: true,
    tweet_mode: "extended",
  }) as Promise<any[]>;

export const makeTweetLows = (
  tweetData: any[],
  listId: string,
  lastNewestTweetDataId: string,
) => {
  const lastIndexOldTweetData = tweetData.findIndex(
    (e) => e.id === lastNewestTweetDataId,
  );
  const newTweetData: any[] =
    lastIndexOldTweetData < 0
      ? tweetData
      : tweetData.slice(lastIndexOldTweetData + 1);
  return newTweetData.map((e) => makeTweetLow(e, listId)).reverse();
};

export const getNewTweetLows = async (
  lastNewestTweetDataId: string,
  listId: string,
  client: Twitter,
) => {
  console.log("getNew");
  const response = await getNewTweetData(listId, client);
  const lastIndexOldTweetData = response.findIndex(
    (e) => e.id === lastNewestTweetDataId,
  );
  const newTweetData: any[] =
    lastIndexOldTweetData < 0
      ? response
      : response.slice(lastIndexOldTweetData + 1);
  return newTweetData.map((e) => makeTweetLow(e, listId)).reverse();
};
