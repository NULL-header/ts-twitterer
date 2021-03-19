import React, { memo, useMemo, useCallback } from "react";
import { Select } from "@chakra-ui/react";
import { useTimelineDetail } from "./context";

export const ListSelector = memo(() => {
  const { setTimelineDetail, timelineDetail } = useTimelineDetail();
  const currentList = useMemo(() => timelineDetail.currentList, [
    timelineDetail.currentList,
  ]);
  const listids = useMemo(() => timelineDetail.listids, [
    timelineDetail.listids,
  ]);
  const setCurrentList = useCallback(
    (e: React.SyntheticEvent<HTMLSelectElement, Event>) =>
      setTimelineDetail((detail) =>
        detail.set("currentList", e.currentTarget.value),
      ),
    [],
  );
  return (
    <Select
      variant="flushed"
      placeholder="select listid"
      onSelect={setCurrentList}
      defaultValue={currentList}
    >
      {listids.map((e) => (
        <option value={e} key={e}>
          {e}
        </option>
      ))}
    </Select>
  );
});
ListSelector.displayName = "ListSelector";
