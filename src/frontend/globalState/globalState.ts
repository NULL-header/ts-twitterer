/* eslint-disable camelcase */
import { Dispatch } from "react";
import { createContainer } from "react-tracked";
import { useReducerAsync } from "use-reducer-async";
import update from "immutability-helper";
// eslint-disable-next-line import/no-webpack-loader-syntax
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
  AsyncDispatch,
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

const makeAsyncDispatch = (
  dispatch: AsyncDispatch,
): ((arg: AsyncAction) => Promise<boolean>) => (args: AsyncAction) =>
  new Promise((resolve) => dispatch({ callback: resolve, ...args }));

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
  GET_TWEETS_BASE: (args) => async (action) => {
    await adjustFlag(
      "isGettingTweets",
      args,
      async () => await saveTweets(args.getState()),
      action.callback,
    );
  },
  GET_TWEETS: () => async (action) => {
    await dispatchBlank(async () => {
      const dispatch = makeAsyncDispatch(action.dispatch);
      const isSuccessGetting = await dispatch({ type: "GET_TWEETS_BASE" });
      console.log("gettweet");
      console.log({ isSuccessGetting });
      const isSuccessRate = await dispatch({ type: "GET_RATE" });
      if (isSuccessGetting || isSuccessRate)
        await dispatch({ type: "WRITE_CONFIG" });
    }, action.callback);
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
  GET_TWEETS_OF_CURRENT_BASE: (args) => async ({ callback }) => {
    await manageDispatch(
      args,
      async () => await saveTweetFromSingleList(args.getState()),
      callback,
    );
  },
  GET_TWEETS_OF_CURRENT: () => async ({ dispatch, callback }) => {
    await dispatchBlank(async () => {
      const asyncDispatch = makeAsyncDispatch(dispatch);
      await asyncDispatch({
        type: "GET_TWEETS_OF_CURRENT_BASE",
      });
      await asyncDispatch({ type: "GET_RATE" });
    }, callback);
  },
  UPDATE_TWEETS: (args) => async ({ dispatch, callback }) => {
    await adjustFlag(
      "isUpdatingTweets",
      args,
      async () => {
        const asyncDispatch = makeAsyncDispatch(dispatch);
        console.log("start updating");
        const isSuccessGetting = await asyncDispatch({
          type: "GET_TWEETS_OF_CURRENT",
          dispatch,
        });
        console.log({ isSuccessGetting });
        if (isSuccessGetting)
          await asyncDispatch({
            type: "LOAD_NEW_TWEETS",
          });
        console.log("finish updating");
        return undefined;
      },
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
        const { listIds, newestTweetDataIdMap } = args.getState();
        const newMap = update(newestTweetDataIdMap, { $add: [[listId, "0"]] });
        return {
          listIds: [...listIds, listId],
          newestTweetDataIdMap: newMap,
        } as State;
      },
      callback,
    );
  },
  DELETE_LISTIDS: (args) => async ({ listId, callback }) => {
    await manageDispatch(
      args,
      async () => {
        const { listIds, newestTweetDataIdMap } = args.getState();
        const newListIds = listIds.filter((e) => e !== listId);
        const newDataMap = update(newestTweetDataIdMap, {
          $add: [[listId, undefined as any]],
        });
        return {
          listIds: newListIds,
          newestTweetDataIdMap: newDataMap,
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
