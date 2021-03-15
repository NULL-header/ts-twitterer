import {
  TweetsDetailObj,
  TweetsDetail,
} from "frontend/components/main/Timeline/TweetsDetail";
import { db } from "./db";

export const deleteCacheTweetsAll = async ({
  tweetsDetailObj,
}: {
  tweetsDetailObj: TweetsDetailObj;
}) => {
  const promise = db.tweets.clear();
  const nextDetailObj = new TweetsDetail()
    .load(tweetsDetailObj)
    .merge({
      newestDataidMap: {},
      newestUniqidMap: {},
      oldestUniqidMap: {},
      tweets: [],
    } as any)
    .toJS();
  await promise;
  return nextDetailObj;
};
