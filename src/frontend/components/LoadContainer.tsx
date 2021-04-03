import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAsyncTask } from "react-hooks-async";
import { useGlobal } from "frontend/globalState";

// const useMoratorium = (deps: any[]) => {
//   const beforeRef = useRef<null | boolean>(null);
//   useUpdateEffect(() => {
//     if (beforeRef.current == null) beforeRef.current = false;
//     if (!beforeRef.current) beforeRef.current = true;
//   }, deps);
//   return { isFired: () => beforeRef.current };
// };

// const useLimitGetEffect = () => {
//   const [{ isGettingTweets }, dispatch] = useTracked();
//   const { isFired } = useMoratorium([isGettingTweets]);

//   useUpdateEffect(() => {
//     console.log("usemlimit", { isFired: isFired() });
//     if (!isFired()) return;
//     console.log("get_late");
//     dispatch({ type: "GET_RATE" });
//   }, [isGettingTweets]);
// };

// const useWriteEffect = () => {
//   const [state, dispatch] = useTracked();
//   const {
//     isAuthorized,
//     currentList,
//     listIds,
//     limitData,
//     isInitializing,
//     tweetsDetail,
//   } = state;
//   const { isFired } = useMoratorium([isInitializing]);
//   useEffect(() => {
//     if (!isFired()) return;
//     console.log("effect");
//     dispatch({ type: "WRITE_CONFIG" });
//   }, [isAuthorized, currentList, listIds, limitData, tweetsDetail]);
// };

const useLoadTasks = (setState: (state: any) => void) => {
  const loadMainTask = useAsyncTask(
    useCallback(async ({ signal }) => {
      const { Component } = await import(
        /* webpackChunkName: "main" */ "./main"
      );
      if (signal.aborted) return;
      setState(Component);
    }, []),
  );
  const loadAuthTask = useAsyncTask(
    useCallback(async ({ signal }) => {
      const { Component } = await import(
        /* webpackChunkName: "auth" */ "./auth"
      );
      if (signal.aborted) return;
      setState(Component);
    }, []),
  );
  return { loadMainTask, loadAuthTask };
};

const useGlobalData = () => {
  const [globalState] = useGlobal();
  console.log(globalState);
  const isLoading = useMemo(() => globalState.isLoadingFromDB, [
    globalState.isLoadingFromDB,
  ]);
  const isAuthorized = useMemo(() => globalState.globalData.isAuthorized, [
    globalState.globalData.isAuthorized,
  ]);
  return { isLoading, isAuthorized };
};

export const LoadContainer = () => {
  const [Component, setComponent] = useState<React.FC | undefined>(undefined);
  const { loadAuthTask, loadMainTask } = useLoadTasks(setComponent);
  const { isAuthorized, isLoading } = useGlobalData();
  useEffect(() => {
    if (isLoading == null || isLoading) return;
    console.log(isAuthorized);
    if (isAuthorized) {
      loadMainTask.start();
      return;
    }
    loadAuthTask.start();
  }, [isAuthorized, isLoading]);

  if (Component != null) return <Component />;
  return <div>Loading</div>;
};
