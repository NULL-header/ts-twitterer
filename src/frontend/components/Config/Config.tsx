import React from "react";
import { useTracked } from "frontend/globalState";
import { useStyles } from "./style";
import { CONSTVALUE } from "../../CONSTVALUE";

export const Config: React.FC = React.memo(() => {
  const [state, dispatch] = useTracked();
  const {
    listIds,
    newestTweetDataIdGroup,
    lastTweetIdGroup,
    tweetGroup,
  } = state;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
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
    [dispatch, lastTweetIdGroup, listIds, newestTweetDataIdGroup, tweetGroup],
  );
  const toggleTheme = React.useCallback(() => {
    dispatch({ type: "TOGGLE_THEME", dispatch });
  }, [dispatch]);

  console.log({ listIds });
  return (
    <div className={classes.root}>
      <h2>Config</h2>
      <hr className={classes.divider} />
      <form onSubmit={handleSubmit}>
        <h3>Ids of a list</h3>
        <ul>
          {listIds.map((e) => (
            <li key={e}>{e}</li>
          ))}
          <li>
            <input
              ref={inputRef}
              placeholder="write ids you wanna add any lists"
            />
          </li>
        </ul>
      </form>
      <h3>Toggle Theme</h3>
      <button onClick={toggleTheme} type="button">
        here
      </button>
    </div>
  );
});
