/* eslint-disable camelcase */
import { Dispatch } from "react";
import { createContainer } from "react-tracked";
import { useReducerAsync } from "use-reducer-async";
import { useMount } from "react-use";
import {
  saveTweetFromSingleList,
  saveTweets,
  deleteCacheConfig,
  deleteCacheTweetsAll,
  initialize,
  loadNewTweets,
  saveConfigs,
} from "../worker/connect";
import {
  State,
  Flags,
  Action,
  GlobalAsyncReducer,
  GlobalReducer,
  AsyncAction,
} from "./types";
import { CONSTVALUE } from "../CONSTVALUE";

const reducer: GlobalReducer = (state, action) => {
  switch (action.type) {
    case "MODIFY": {
      return { ...state, ...action.state };
    }
    default: {
      throw new Error("An error occurred to modify the global state");
    }
  }
};

interface ReducerArgs {
  dispatch: Dispatch<Action>;
  signal: AbortSignal;
  getState: () => State;
}

const runWithCallback = async (
  process: () => Promise<Partial<State> | undefined | void>,
  callback: (arg: boolean) => void,
) =>
  await process().catch((err) => {
    callback(false);
    console.log(err);
    return undefined;
  });

const makeSendResult = (callback: (isSucess: boolean) => void = () => {}) =>
  callback;

const dispatchBlank = async (
  process: () => Promise<void>,
  callback?: (arg: boolean) => void,
) => {
  const sendResult = makeSendResult(callback);
  await runWithCallback(process, sendResult);
  sendResult(true);
};

const manageDispatch = async (
  { dispatch, signal }: ReducerArgs,
  process: () => Promise<Partial<State> | undefined>,
  callback?: (arg: boolean) => void,
) => {
  const sendResult = makeSendResult(callback);
  const result = await runWithCallback(process, sendResult);
  if (signal.aborted || result == null) {
    sendResult(false);
    return;
  }
  dispatch({ type: "MODIFY", state: result });
  sendResult(true);
};

const adjustFlag = async (
  flagName: keyof Flags,
  { dispatch, signal, getState }: ReducerArgs,
  process: () => Promise<Partial<State> | undefined>,
  callback?: (arg: boolean) => void,
) => {
  const sendResult = makeSendResult(callback);
  const currentFlag = getState()[flagName];
  if (currentFlag) {
    sendResult(false);
    return;
  }
  dispatch({ type: "MODIFY", state: { [flagName]: true } });
  const result = (await runWithCallback(process, sendResult)) || {};
  if (signal.aborted) return;
  dispatch({ type: "MODIFY", state: { ...result, [flagName]: false } });
  sendResult(true);
};

const asyncReducer: GlobalAsyncReducer = {
  LOAD_NEW_TWEETS: (args) => async (action) => {
    await adjustFlag(
      "isLoadingTweets",
      args,
      async () => await loadNewTweets(args.getState()),
      action.callback,
    );
  },
  INITIALIZE: (args) => async () => {
    await adjustFlag("isInitializing", args, async () => await initialize());
  },
  GET_TWEETS: (args) => async (action) => {
    await adjustFlag(
      "isGettingTweets",
      args,
      async () => await saveTweets(args.getState()),
      action.callback,
    );
  },
  DELETE_CACHE_TWEETS: (args) => async () => {
    await adjustFlag(
      "isDeletingTweets",
      args,
      async () => await deleteCacheTweetsAll(),
    );
  },
  DELETE_CACHE_CONFIG: (args) => async (action) => {
    await adjustFlag(
      "isDeletingConfigs",
      args,
      async () => await deleteCacheConfig(),
      action.callback,
    );
  },
  GET_TWEETS_OF_CURRENT: (args) => async ({ callback }) => {
    await manageDispatch(
      args,
      async () => await saveTweetFromSingleList(args.getState()),
      callback,
    );
  },
  WRITE_CONFIG: (args) => async (action) => {
    await adjustFlag(
      "isWritingConfig",
      args,
      async () => {
        const state = args.getState();
        console.log(state);
        saveConfigs(state);
        return undefined;
      },
      action.callback,
    );
  },
  GET_RATE: (args) => async (action) => {
    await manageDispatch(
      args,
      async () => {
        const response = await fetch(CONSTVALUE.GET_RATE_URL);
        const limitData = (await response.json()) as LimitData;
        return { limitData };
      },
      action.callback,
    );
  },
  ADD_LISTIDS: (args) => async ({ callback, listId }) => {
    await manageDispatch(
      args,
      async () => {
        const { listIds } = args.getState();
        return {
          listIds: [...listIds, listId],
        } as State;
      },
      callback,
    );
  },
  DELETE_LISTIDS: (args) => async ({ listId, callback }) => {
    await manageDispatch(
      args,
      async () => {
        const { listIds } = args.getState();
        const newListIds = listIds.filter((e) => e !== listId);
        return {
          listIds: newListIds,
        };
      },
      callback,
    );
  },
  AUTHORISE: ({ getState, dispatch }) => async ({ callback }) => {
    await dispatchBlank(async () => {
      const { isAuthorized } = getState();
      dispatch({ type: "MODIFY", state: { isAuthorized: !isAuthorized } });
    }, callback);
  },
};

const useValue = () => {
  const [state, dispatch] = useReducerAsync<
    GlobalReducer,
    AsyncAction,
    AsyncAction | Action
  >(
    reducer,
    {
      isLoadingTweets: false,
      isSettingTweets: false,
      isGettingTweets: false,
      isDeletingTweets: false,
      isDeletingConfigs: false,
      isUpdatingTweets: false,
      isWritingConfig: false,
      isInitializing: undefined,
      lastTweetId: 0,
      tweets: [],
      newestTweetDataIdMap: new Map(),
      newestUniqIdMap: new Map(),
      oldestUniqIdMap: new Map(),
      listIds: [],
      currentList: undefined,
      limitData: undefined,
      isAuthorized: false,
    } as State,
    asyncReducer,
  );
  useMount(() => {
    dispatch({ type: "INITIALIZE" });
  });

  return [state, dispatch] as const;
};

export const { Provider, useTracked, useUpdate, useSelector } = createContainer(
  useValue,
);
