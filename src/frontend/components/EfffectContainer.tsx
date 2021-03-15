import React, { memo, useCallback } from "react";
import { useMount } from "react-use";
import { useSetGlobalState } from "frontend/globalState";
import { initializeGlobal } from "frontend/worker/connect";
import { useAsyncTask } from "react-hooks-async";
import { NoLastGlobalDataError } from "frontend/errors";
import { AsyncReturnType } from "type-fest";

const getLastData = async () => {
  let result: AsyncReturnType<typeof initializeGlobal> | undefined;
  try {
    result = await initializeGlobal();
  } catch (e) {
    if (e instanceof NoLastGlobalDataError) {
      result = undefined;
    }
  }
  return result;
};

export const EffectContainer = memo(({ children }) => {
  const setGlobalState = useSetGlobalState();
  const initTask = useAsyncTask(
    useCallback(async ({ signal }) => {
      setGlobalState((state) => state.set("isLoadingFromDB", true));
      const result = await getLastData();
      if (signal.aborted) return;
      if (result == null) {
        setGlobalState((state) => state.set("isLoadingFromDB", false));
        return;
      }
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
