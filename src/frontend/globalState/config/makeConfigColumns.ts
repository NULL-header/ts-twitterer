import { State } from "../types";

export const makeConfigColumns = (state: State): ConfigColumns => {
  const {
    currentList,
    lastTweetIdGroup,
    limitData,
    listIds,
    newestTweetDataIdGroup,
    themename,
  } = state as Configs;
  return {
    id: 0,
    last_data: {
      currentList,
      lastTweetIdGroup,
      limitData,
      listIds,
      newestTweetDataIdGroup,
      themename,
    },
  };
};
