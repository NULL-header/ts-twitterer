import React, { memo, useCallback } from "react";
import { Select } from "@chakra-ui/react";
import { useDispatch, useSelector } from "./context";

export const ListSelector = memo(() => {
  const dispatch = useDispatch();
  const currentList = useSelector((state) => state.tweetsManager.currentList);
  const listids = useSelector((state) => state.tweetsManager.listids);
  const setCurrentList = useCallback(
    (e: React.SyntheticEvent<HTMLSelectElement, Event>) =>
      dispatch({
        type: "DISPATCH_ASYNC",
        updater: (state) =>
          state.update("tweetsManager", (manager) =>
            manager.set("currentList", e.currentTarget.value),
          ),
      }),
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
