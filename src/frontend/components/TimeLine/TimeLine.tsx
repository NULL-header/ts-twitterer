import React from "react";
import { useReducerAsync, AsyncActionHandlers } from "use-reducer-async";
import { Tweet } from "src/frontend/components";
type State = { loading: boolean; tweets?: any[] };
type Action = { type: "MODIFY"; state: Partial<State> };
type AsyncAction = { type: "START_FETCH" };
const initialState = {
  loading: false,
  tweets: undefined,
} as State;

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "MODIFY": {
      return { ...state, ...action.state };
    }
  }
};

const asyncReducer: AsyncActionHandlers<typeof reducer, AsyncAction> = {
  START_FETCH: ({ dispatch, signal }) => async (action) => {
    dispatch({ type: "MODIFY", state: { loading: true } });
    const res = await fetch("/api/sample");
    const tweets = await res.json();
    if (signal.aborted) return;
    dispatch({ type: "MODIFY", state: { loading: false, tweets } });
  },
};

export const TimeLine: React.FC = React.memo((props) => {
  const [state, dispatch] = useReducerAsync(
    reducer,
    initialState,
    asyncReducer
  );
  React.useEffect(() => {
    dispatch({ type: "START_FETCH" });
  }, [dispatch]);
  return (
    <div>
      {state.loading && "Loading..."}
      {state.tweets &&
        state.tweets.map((e, i) => (
          <Tweet
            key={i}
            {...{
              content: e.text,
              iconUrl: e.user.profile_image_url,
              userid: e.user.screen_name,
              username: e.user.name,
            }}
          />
        ))}
    </div>
  );
});
