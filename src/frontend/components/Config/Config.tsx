import React from "react";
import { useTracked } from "frontend/globalState";
import { ContentContainer } from "../ContentContainer";
import { CONSTVALUE } from "../../CONSTVALUE";

const Config = React.memo(() => {
  const [state, dispatch] = useTracked();
  const {
    listIds,
    newestTweetDataIdGroup,
    lastTweetIdGroup,
    tweetGroup,
  } = state;
  const inputRef = React.useRef<HTMLInputElement | null>(null);
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
    <ContentContainer header="Config">
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
      <button
        onClick={toggleTheme}
        type="button"
        aria-label="toggleThemeButton"
      >
        here
      </button>
    </ContentContainer>
  );
});

Config.displayName = "Config";

export { Config };
