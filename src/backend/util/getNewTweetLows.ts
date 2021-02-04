import Twitter from "twitter";
import { CONSTVALUE } from "../CONSTVALUE";
import { makeTweetLow } from "./makeTweetLow";

export const getNewTweetLows = async (
  lastNewestTweetDataId: number,
  twitter: Twitter
) => {
  const response = await twitter.get("lists/statuses", {
    list_id: CONSTVALUE.SAMPLE_LIST_ID,
    // include_rts: true,
    tweet_mode: "extended",
  });
  console.log(
    response.map((e: any) => e.entities.media).filter((e: any) => e)[0][0].sizes
  );
  const lastIndexOldTweetData = (response as any[]).findIndex(
    (e) => e.id === lastNewestTweetDataId
  );
  const newTweetData: any[] =
    lastIndexOldTweetData < 0
      ? response
      : response.slice(lastIndexOldTweetData + 1);
  return newTweetData.map((e) => makeTweetLow(e));
};
