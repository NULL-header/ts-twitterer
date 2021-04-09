import { useEffect, Reducer, useRef } from "react";
import { createContainer } from "react-tracked";

import { useReducerAsync, AsyncActionHandlers } from "use-reducer-async";
import { useMount } from "react-use";
import { TimelineDetail } from "./TimelineDetail";

const reducer: Reducer<
  TimelineDetail,
  { type: "UPDATE"; nextValue: TimelineDetail }
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

type Result = TimelineDetail;
type AsyncResult =
  | Promise<TimelineDetail>
  | (TimelineDetail | Promise<TimelineDetail>)[];

type AsyncAction =
  | {
      type: "DISPATCH_ASYNC";
      updater: (state: TimelineDetail) => Result | AsyncResult;
    }
  | {
      type: "CALL_ASYNC";
      caller: (voids: ReturnType<TimelineDetail["getVoids"]>) => Promise<void>;
    };

const asyncReducer: AsyncActionHandlers<typeof reducer, AsyncAction> = {
  DISPATCH_ASYNC: ({ dispatch, getState, signal }) => async (action) => {
    let result;
    try {
      result = action.updater(getState());
    } catch (_) {
      return;
    }
    if (result instanceof TimelineDetail) {
      dispatch({ type: "UPDATE", nextValue: result });
    } else if (Array.isArray(result)) {
      let i = 0;
      while (i < result.length) {
        const target = result[i];
        if (target instanceof TimelineDetail) {
          dispatch({ type: "UPDATE", nextValue: target });
        } else {
          // eslint-disable-next-line no-await-in-loop
          const awaited = await target.catch(() => undefined);
          if (signal.aborted || awaited == null) return;
          dispatch({ type: "UPDATE", nextValue: awaited });
        }
        i += 1;
      }
    } else {
      const awaited = await result.catch(() => undefined);
      if (signal.aborted || awaited == null) return;
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
  useTracked: useTimelineDetail,
  useUpdate: useDispatch,
  useSelector,
} = createContainer(() => {
  const [state, dispatch] = useReducerAsync(
    reducer,
    new TimelineDetail(),
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
