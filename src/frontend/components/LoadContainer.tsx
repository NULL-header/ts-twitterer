import React, { useEffect, FC, useRef } from "react";
import { useReducerAsync, AsyncActionHandlers } from "use-reducer-async";
import { useTracked } from "frontend/globalState";
import { useUpdateEffect } from "react-use";

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

const useMoratorium = (deps: any[]) => {
  const beforeRef = useRef<null | boolean>(null);
  useUpdateEffect(() => {
    if (beforeRef.current == null) beforeRef.current = false;
    if (!beforeRef.current) beforeRef.current = true;
  }, deps);
  return { isFired: () => beforeRef.current };
};

const useLimitGetEffect = () => {
  const [{ isGettingTweets }, dispatch] = useTracked();
  const { isFired } = useMoratorium([isGettingTweets]);

  useUpdateEffect(() => {
    console.log("usemlimit", { isFired: isFired() });
    if (!isFired()) return;
    console.log("get_late");
    dispatch({ type: "GET_RATE" });
  }, [isGettingTweets]);
};

const useWriteEffect = () => {
  const [state, dispatch] = useTracked();
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
  const { isFired } = useMoratorium([isInitializing]);
  useEffect(() => {
    if (!isFired()) return;
    console.log("effect");
    dispatch({ type: "WRITE_CONFIG" });
  }, [
    isAuthorized,
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
  useLimitGetEffect();

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
