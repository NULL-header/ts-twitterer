import React, { memo } from "react";
import { Select } from "@chakra-ui/react";
import { List } from "immutable";

export const ListSelector = memo<{
  listids: List<string>;
  currentList: string | undefined;
  setCurrentList: (listId: string) => void;
}>(({ currentList, listids, setCurrentList }) => (
  <Select
    variant="flushed"
    placeholder="select listid"
    onSelect={(e) => setCurrentList(e.currentTarget.value)}
    defaultValue={currentList}
  >
    {listids.map((e) => (
      <option value={e} key={e}>
        {e}
      </option>
    ))}
  </Select>
));
ListSelector.displayName = "ListSelector";
