import { State } from "frontend/globalState/types";
import { Work } from "./types";
import { db } from "./db";

const makeConfigColumns = (state: State): ConfigColumns => {
  const {
    currentList,
    oldestUniqIdMap,
    newestUniqIdMap,
    limitData,
    listIds,
    newestTweetDataIdMap,
    tweets,
    isAuthorized,
  } = state as Configs & Pick<State, "tweets">;
  return {
    id: 0,
    last_data: {
      currentList,
      oldestUniqIdMap,
      newestUniqIdMap,
      limitData,
      listIds,
      newestTweetDataIdMap,
      tweets,
      isAuthorized,
    },
  };
};

export const saveConfigs: Work = async (state) => {
  const configColumns = makeConfigColumns(state);
  await db.configs.put(configColumns);
  return undefined;
};
