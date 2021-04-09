import { TweetsManager } from "frontend/components/main/Timeline/TweetsManager";
import { db } from "./db";

type TimelineObj = ReturnType<typeof TweetsManager.prototype.toJS>;

export const saveTimelineDetail = async (obj: TimelineObj) => {
  await db.timelineDetail.put({ uniqid: 0, lastData: obj });
};

export const loadTimelineDetail = async () => {
  const result = await db.timelineDetail.get(0);
  if (result == null) throw new Error("The last tweet data is nothing.");
  return result.lastData;
};
