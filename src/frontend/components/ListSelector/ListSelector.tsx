import React from "react";
import { useSelector, useUpdate } from "src/frontend/globalState";

export const ListSelector: React.FC = React.memo(() => {
  const listIds = useSelector((state) => state.listIds);
  const dispatch = useUpdate();
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      const listId = event.currentTarget.value;
      dispatch({ type: "MODIFY", state: { currentList: listId } });
    },
    [dispatch]
  );
  return (
    <div>
      {listIds.map((e, i) => (
        <div key={i}>
          <input
            name="list"
            type="radio"
            value={e}
            onClick={handleClick}
          ></input>
          {e}
        </div>
      ))}
    </div>
  );
});
