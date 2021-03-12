import { State } from "frontend/globalState/types";
import {
  TweetsDetailObj,
  TweetsDetail,
} from "frontend/globalState/models/TweetsDetail";
import Immutable from "immutable";
import { db } from "./db";

export const deleteCacheConfig = async () => {
  const promise = db.configs.clear();
  const initValue = {
    currentList: undefined,
    limitData: undefined,
    listIds: [] as string[],
  } as State;
  const value = {
    nextState: initValue,
    tweetsDetailObj: {} as TweetsDetailObj,
  };
  await promise;
  return value;
};

export const deleteCacheTweetsAll = async ({
  tweetsDetailObj,
}: {
  tweetsDetailObj: TweetsDetailObj;
}) => {
  const promise = db.tweets.clear();
  const nextDetailObj = new TweetsDetail()
    .load(tweetsDetailObj)
    .set("newestDataidMap", Immutable.Map())
    .set("newestDataidMap", Immutable.Map())
    .set("oldestUniqidMap", Immutable.Map())
    .set("tweets", Immutable.List())
    .toJS();
  await promise;
  return nextDetailObj;
};
