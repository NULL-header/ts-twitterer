import { makeTweetLow } from "./makeTweetLow";
import { twitterApi } from "../twitterApi";

export const getNewTweetLows = async (
  lastNewestTweetDataId: string,
  listId: string
) => {
  console.log("getNew");
  const response = (await twitterApi
    .get("lists/statuses", {
      list_id: listId,
      // include_rts: true,
      tweet_mode: "extended",
    })
    .catch((err) => console.log(err))) as any[];
  const lastIndexOldTweetData = (response as any[]).findIndex(
    (e) => e.id === lastNewestTweetDataId
  );
  const newTweetData: any[] =
    lastIndexOldTweetData < 0
      ? response
      : response.slice(lastIndexOldTweetData + 1);
  return newTweetData.map((e) => makeTweetLow(e, listId));
};
