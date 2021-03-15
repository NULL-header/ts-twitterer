import { NoLastGlobalDataError } from "frontend/errors";
import { db } from "./db";

const loadGlobalData = async () => {
  const dataNullable = await db.globalData.get(0);
  if (dataNullable == null) throw new NoLastGlobalDataError();
  return dataNullable.lastData;
};

export const initializeGlobal = async () => await loadGlobalData();
