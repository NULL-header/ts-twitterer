import { State } from "frontend/globalState/types";
import { Work } from "./types";
import { db } from "./db";

const makeConfigColumns = (state: State): ConfigColumns => {
  const {
    currentList,
    limitData,
    listIds,
    tweetsDetail,
    isAuthorized,
  } = state as Configs & Pick<State, "tweetsDetail">;
  return {
    id: 0,
    last_data: {
      currentList,
      limitData,
      listIds,
      isAuthorized,
      tweetsDetail,
    },
  };
};

export const saveConfigs: Work = async (state) => {
  const configColumns = makeConfigColumns(state);
  await db.configs.put(configColumns);
  return undefined;
};
