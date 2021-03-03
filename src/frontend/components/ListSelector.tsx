import React from "react";
import { useTracked } from "frontend/globalState";

export const ListSelector: React.FC = React.memo(() => {
  const [state, dispatch] = useTracked();
  const { listIds } = state;
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
      const listId = event.currentTarget.value;
      dispatch({ type: "MODIFY", state: { currentList: listId } });
    },
    [dispatch],
  );
  return (
    <div>
      {listIds.map((e) => (
        <div key={e}>
          <input name="list" type="radio" value={e} onClick={handleClick} />
          {e}
        </div>
      ))}
    </div>
  );
});
