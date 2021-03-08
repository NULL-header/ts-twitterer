import { State } from "frontend/globalState/types";
import { Work } from "./types";
import { db } from "./db";

const makeConfigColumns = (state: State): ConfigColumns => {
  const {
    currentList,
    lastTweetId,
    limitData,
    listIds,
    newestTweetDataIdMap,
  } = state as Configs;
  return {
    id: 0,
    last_data: {
      currentList,
      lastTweetId,
      limitData,
      listIds,
      newestTweetDataIdMap,
    },
  };
};

export const saveConfigs: Work = async (state) => {
  const configColumns = makeConfigColumns(state);
  await db.configs.put(configColumns);
  return undefined;
};
