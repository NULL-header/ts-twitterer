import React from "react";
import { useSelector, useUpdate } from "src/frontend/globalState";
import { useStyles } from "./style";
import { CONSTVALUE } from "../../CONSTVALUE";

export const Config: React.FC = React.memo(() => {
  const listIds = useSelector((state) => state.listIds);
  const newestTweetDataIdGroup = useSelector(
    (state) => state.newestTweetDataIdGroup
  );
  const lastTweetIdGroup = useSelector((state) => state.lastTweetIdGroup);
  const tweetGroup = useSelector((state) => state.tweetGroup);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const dispatch = useUpdate();
  const classes = useStyles();
  const handleSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (inputRef.current == null || listIds.length >= CONSTVALUE.LIST_LIMIT)
        return;
      const listId = inputRef.current.value;
      if (listId.length === 0) return;
      dispatch({
        type: "MODIFY",
        state: {
          listIds: [...listIds, listId],
          newestTweetDataIdGroup: { ...newestTweetDataIdGroup, [listId]: "0" },
          lastTweetIdGroup: { ...lastTweetIdGroup, [listId]: 0 },
          tweetGroup: { ...tweetGroup, [listId]: [] },
        },
      });
      inputRef.current.value = "";
    },
    [dispatch, lastTweetIdGroup, listIds, newestTweetDataIdGroup, tweetGroup]
  );
  console.log({ listIds });
  return (
    <div className={classes.root}>
      <h2>Config</h2>
      <hr className={classes.divider} />
      <form onSubmit={handleSubmit}>
        <h3>Ids of a list</h3>
        <ul>
          {listIds.map((e, i) => (
            <li key={i}>{e}</li>
          ))}
          <li>
            <input
              ref={inputRef}
              placeholder="write ids you wanna add any lists"
            ></input>
          </li>
        </ul>
      </form>
    </div>
  );
});
