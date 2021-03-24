import React, {
  createContext,
  Dispatch,
  SetStateAction,
  ReactNode,
  useState,
  useMemo,
  memo,
  useContext,
} from "react";
import { TimelineDetail } from "./TimelineDetail";

const context = createContext<{
  timelineDetail: TimelineDetail;
  setTimelineDetail: Dispatch<SetStateAction<TimelineDetail>>;
}>(null as any);

export const Provider = memo<{ children: ReactNode }>(({ children }) => {
  const [timelineDetail, setTimelineDetail] = useState(new TimelineDetail());
  const value = useMemo(() => ({ timelineDetail, setTimelineDetail }), [
    timelineDetail,
  ]);
  return <context.Provider value={value}>{children}</context.Provider>;
});

export const useTimelineDetail = () => useContext(context);
export const useSetGlobalDetail = () => {
  const { setTimelineDetail } = useTimelineDetail();
  return useMemo(() => setTimelineDetail, []);
};
