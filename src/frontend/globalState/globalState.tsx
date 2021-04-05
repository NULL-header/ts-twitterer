/* eslint-disable camelcase */
import { useEffect, Reducer, useRef } from "react";
import { createContainer } from "react-tracked";
import { useReducerAsync, AsyncActionHandlers } from "use-reducer-async";
import { useMount } from "react-use";
import { GlobalDetail } from "./GlobalDetail";

const reducer: Reducer<
  GlobalDetail,
  { type: "UPDATE"; nextValue: GlobalDetail }
> = (_, action) => {
  switch (action.type) {
    case "UPDATE": {
      return action.nextValue;
    }
    default: {
      throw new Error("unknown error");
    }
  }
};

type Result = GlobalDetail;
type AsyncResult =
  | Promise<GlobalDetail>
  | (GlobalDetail | Promise<GlobalDetail>)[];

type AsyncAction =
  | {
      type: "DISPATCH_ASYNC";
      updater: (state: GlobalDetail) => Result | AsyncResult;
    }
  | {
      type: "CALL_ASYNC";
      caller: (voids: ReturnType<GlobalDetail["getVoids"]>) => Promise<void>;
    };

const asyncReducer: AsyncActionHandlers<typeof reducer, AsyncAction> = {
  DISPATCH_ASYNC: ({ dispatch, getState, signal }) => async (action) => {
    const result = action.updater(getState());
    if (result instanceof GlobalDetail) {
      dispatch({ type: "UPDATE", nextValue: result });
    } else if (Array.isArray(result)) {
      let i = 0;
      while (i < result.length) {
        const target = result[i];
        if (target instanceof GlobalDetail) {
          dispatch({ type: "UPDATE", nextValue: target });
        } else {
          // eslint-disable-next-line no-await-in-loop
          const awaited = await target;
          if (signal.aborted) return;
          dispatch({ type: "UPDATE", nextValue: awaited });
        }
        i += 1;
      }
    } else {
      const awaited = await result;
      if (signal.aborted) return;
      dispatch({ type: "UPDATE", nextValue: awaited });
    }
  },
  CALL_ASYNC: ({ getState }) => async (action) => {
    console.log(getState());
    await action.caller(getState().getVoids());
  },
};

export const {
  Provider,
  useTracked: useGlobal,
  useUpdate: useDispatch,
} = createContainer(() => {
  const [state, dispatch] = useReducerAsync(
    reducer,
    new GlobalDetail(),
    asyncReducer,
  );
  const waiterRef = useRef(false);
  useEffect(() => {
    if (state.isLoadingFromDB == null || state.isLoadingFromDB) return;
    if (!waiterRef.current) {
      waiterRef.current = true;
      return;
    }
    dispatch({ type: "CALL_ASYNC", caller: (voids) => voids.save() });
  }, [state]);
  useMount(() => {
    dispatch({
      type: "DISPATCH_ASYNC",
      updater: (nextState) => nextState.load(),
    });
  });
  // todo usemount load
  return [state, dispatch] as const;
});
