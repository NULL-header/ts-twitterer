import { TimelineDetail } from "frontend/components/main/Timeline/TimelineDetail";
import { db } from "./db";

type TimelineObj = ReturnType<typeof TimelineDetail.prototype.toJS>;

export const saveTimelineDetail = async (obj: TimelineObj) => {
  await db.timelineDetail.put({ uniqid: 0, lastData: obj });
};

export const loadTimelineDetail = async () => {
  const result = await db.timelineDetail.get(0);
  return result?.lastData;
};
