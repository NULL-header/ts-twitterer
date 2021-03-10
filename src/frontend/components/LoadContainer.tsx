import React, { useEffect, FC, useRef } from "react";
import { useReducerAsync, AsyncActionHandlers } from "use-reducer-async";
import { useTracked } from "frontend/globalState";

type Action = { type: "MODIFY"; Component: FC };
type AsyncAction = { type: "LOAD_AUTH" } | { type: "LOAD_MAIN" };

type State = FC | undefined;

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "MODIFY": {
      return action.Component as State;
    }
    default: {
      throw new Error("An error occurred to modify the global state");
    }
  }
};

const asyncReducer: AsyncActionHandlers<typeof reducer, AsyncAction> = {
  LOAD_AUTH: ({ dispatch, signal }) => async () => {
    const { Component } = await import(/* webpackChunkName: "auth" */ "./Auth");
    if (signal.aborted) return;
    dispatch({ type: "MODIFY", Component });
  },
  LOAD_MAIN: ({ dispatch, signal }) => async () => {
    const { Component } = await import(/* webpackChunkName: "main" */ "./main");
    if (signal.aborted) return;
    dispatch({ type: "MODIFY", Component });
  },
};

const useWriteEffect = () => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const [state, dispatch] = useTracked();
  const beforeRef = useRef<null | true>(null);
  const {
    isAuthorized,
    currentList,
    listIds,
    limitData,
    newestTweetDataIdMap,
    newestUniqIdMap,
    oldestUniqIdMap,
    isInitializing,
  } = state;
  useEffect(() => {
    if (isInitializing == null || isInitializing) return;
    if (beforeRef.current == null) {
      beforeRef.current = true;
      return;
    }
    dispatch({ type: "WRITE_CONFIG" });
  }, [
    isAuthorized,
    isInitializing,
    currentList,
    listIds,
    limitData,
    newestTweetDataIdMap,
    newestUniqIdMap,
    oldestUniqIdMap,
  ]);
};

export const LoadContainer = () => {
  const [{ isInitializing, isAuthorized }] = useTracked();
  const [Component, dispatch] = useReducerAsync(
    reducer,
    undefined,
    asyncReducer,
  );

  useWriteEffect();

  useEffect(() => {
    if (isInitializing == null || isInitializing) return;
    if (isAuthorized) dispatch({ type: "LOAD_MAIN" });
    else dispatch({ type: "LOAD_AUTH" });
  }, [isAuthorized, isInitializing]);

  if (isInitializing == null) return <div>Starting</div>;
  if (isInitializing) return <div>Loading</div>;
  if (Component != null) return <Component />;
  return <div>unknown error</div>;
};
