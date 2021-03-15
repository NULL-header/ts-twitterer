import React, { memo, useCallback } from "react";
import { useMount } from "react-use";
import { useSetGlobalState } from "frontend/globalState";
import { initializeGlobal } from "frontend/worker/connect";
import { useAsyncTask } from "react-hooks-async";

export const EffectContainer = memo(({ children }) => {
  const setGlobalState = useSetGlobalState();
  const initTask = useAsyncTask(
    useCallback(async ({ signal }) => {
      setGlobalState((state) => state.set("isLoadingFromDB", true));
      const result = await initializeGlobal();
      if (signal.aborted) return;
      setGlobalState((state) =>
        state.merge({
          globalData: state.globalData.load(result),
          isLoadingFromDB: false,
        }),
      );
    }, []),
  );
  useMount(() => {
    initTask.start();
  });
  return <>{children}</>;
});
