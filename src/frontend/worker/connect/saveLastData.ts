import { GlobalDataObj } from "frontend/globalState/GlobalData";
import { db } from "./db";

export const saveLastData = async ({
  globalDetailObj,
}: {
  globalDetailObj: GlobalDataObj;
}) => {
  await db.globalData.put({ uniqid: 0, lastData: globalDetailObj });
};
