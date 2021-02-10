/* eslint-disable camelcase */
import { db } from "../db";
import { State } from "./types";

export const loadConfigs = async () => {
  const dataNullable = await db.configs.get(0);
  if (dataNullable != null) {
    return dataNullable.last_data;
  }
  return undefined;
};

export const makeConfigColumns = (state: State): ConfigColumns => {
  const {
    currentList,
    lastTweetIdGroup,
    limitData,
    listIds,
    newestTweetDataIdGroup,
  } = state as Configs;
  return {
    id: 0,
    last_data: {
      currentList,
      lastTweetIdGroup,
      limitData,
      listIds,
      newestTweetDataIdGroup,
    },
  };
};
