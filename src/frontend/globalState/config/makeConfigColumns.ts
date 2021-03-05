import { State } from "../types";

export const makeConfigColumns = (state: State): ConfigColumns => {
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
