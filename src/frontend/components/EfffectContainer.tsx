import React, { memo, useCallback, useRef } from "react";
import { useMount, useUpdateEffect } from "react-use";
import { useGlobal } from "frontend/globalState";
import { initializeGlobal, saveLastData } from "frontend/worker/connect";
import { useAsyncTask } from "react-hooks-async";
import { NoLastGlobalDataError } from "frontend/errors";
import { AsyncReturnType } from "type-fest";

const useEffectWithWaitTwoTimes = (effect: () => void, deps: any[]) => {
  const ref = useRef<boolean>(false);
  useUpdateEffect(() => {
    if (!ref.current) ref.current = true;
    else effect();
  }, deps);
};

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
  const [globalState, setGlobalDetail] = useGlobal();
  const initTask = useAsyncTask(
    useCallback(async ({ signal }) => {
      setGlobalDetail((state) => state.set("isLoadingFromDB", true));
      const result = await getLastData();
      if (signal.aborted) return;
      if (result == null) {
        setGlobalDetail((state) => state.set("isLoadingFromDB", false));
        return;
      }
      setGlobalDetail((state) =>
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

  useEffectWithWaitTwoTimes(() => {
    saveLastData({ globalDetailObj: globalState.globalData.toJS() });
  }, [globalState.globalData, globalState.isLoadingFromDB]);

  return <>{children}</>;
});
