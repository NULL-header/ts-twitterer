import { ConfigInitError } from "frontend/globalState/errors";
import { State } from "frontend/globalState/types";
import { db } from "./db";

const loadConfigs = async () => {
  const dataNullable = await db.configs.get(0);
  if (dataNullable == null) throw new ConfigInitError();
  return dataNullable.last_data;
};

export const initialize = async () => {
  const lastData = await loadConfigs();
  return lastData as State;
};
