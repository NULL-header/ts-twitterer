import { AuthManager } from "frontend/globalState/AuthManager";
import { db } from "./db";

export const saveLastData = async (
  globalDetailObj: ReturnType<AuthManager["toJS"]>,
) => {
  await db.globalData.put({ uniqid: 0, lastData: globalDetailObj });
};
