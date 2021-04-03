import { useState } from "react";
import { createContainer } from "react-tracked";
import { TimelineDetail } from "./TimelineDetail";

export const {
  Provider,
  useTracked: useTimelineDetail,
  useUpdate: useSetTimelineDetail,
} = createContainer(() => useState(new TimelineDetail()));
