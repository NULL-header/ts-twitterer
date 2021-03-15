import { useRef, useEffect, useCallback } from "react";
import { useAsyncTask } from "react-hooks-async";

export const useConstAsyncTask = <
  T,
  U extends (arg: { signal: AbortSignal; getState: () => T }) => Promise<void>
>(
  state: T,
  effect: U,
) => {
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const getState = useCallback(() => stateRef.current, []);
  return useAsyncTask(
    useCallback(({ signal }) => effect({ getState, signal }), []),
  );
};
