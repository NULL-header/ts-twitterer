import React from "react";
import { useSelector, useUpdate } from "src/frontend/globalState";

export const Config: React.FC = React.memo(() => {
  const listIds = useSelector((state) => state.listIds);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const dispatch = useUpdate();
  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inputRef.current == null) return;
      const listId = inputRef.current.value;
      if (listId.length === 0) return;
      dispatch({ type: "MODIFY", state: { listIds: [...listIds, listId] } });
      inputRef.current.value = "";
    },
    [dispatch, listIds]
  );
  console.log({ listIds });
  return (
    <form onSubmit={handleSubmit}>
      <h3>listIds</h3>
      {listIds.map((e, i) => (
        <div key={i}>{e}</div>
      ))}
      <input ref={inputRef}></input>
    </form>
  );
});
