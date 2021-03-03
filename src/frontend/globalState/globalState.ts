/* eslint-disable camelcase */
import { useEffect, Dispatch } from "react";
import { createContainer } from "react-tracked";
import { useReducerAsync } from "use-reducer-async";
import { omit } from "timm";
import { db } from "../db";
import { getTweets, loadNewTweetGroup } from "./tweets";
import { makeConfigColumns } from "./config";
import { initialize } from "./initialize";
import { deleteCacheTweets, deleteCacheConfig } from "./delete";
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
  LOAD_NEW_TWEETS_BASE: (args) => async (action) => {
    await adjustFlag(
      "isLoadingTweets",
      args,
      async () => await loadNewTweetGroup(args.getState),
      action.callback,
    );
  },
  LOAD_NEW_TWEETS: () => async (action) => {
    await dispatchBlank(async () => {
      const dispatch = makeAsyncDispatch(action.dispatch);
      const isSuccessLoading = await dispatch({
        type: "LOAD_NEW_TWEETS_BASE",
      });
      if (isSuccessLoading) await dispatch({ type: "WRITE_CONFIG" });
    }, action.callback);
  },
  INITIALIZE: (args) => async () => {
    await adjustFlag("isInitializing", args, async () => await initialize());
  },
  GET_TWEETS_BASE: (args) => async (action) => {
    await adjustFlag(
      "isGettingTweets",
      args,
      async () => await getTweets(args.getState),
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
      async () => await deleteCacheTweets(args.getState),
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
  UPDATE_TWEETS: (args) => async (action) => {
    await adjustFlag("isUpdatingTweets", args, async () => {
      const dispatch = makeAsyncDispatch(action.dispatch);
      console.log("start updating");
      const isSuccessGetting = await dispatch({
        type: "GET_TWEETS",
        dispatch: action.dispatch,
      });
      console.log({ isSuccessGetting });
      if (isSuccessGetting)
        await dispatch({ type: "LOAD_NEW_TWEETS", dispatch: action.dispatch });
      console.log("finish updating");
      return undefined;
    });
  },
  WRITE_CONFIG: (args) => async (action) => {
    const configLow = makeConfigColumns(args.getState());
    await adjustFlag(
      "isWritingConfig",
      args,
      async () => {
        await db.configs.put(configLow);
        console.log("config written");
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
  ADD_LISTIDS_BASE: (args) => async ({ callback, listId }) => {
    await manageDispatch(
      args,
      async () => {
        const {
          listIds,
          newestTweetDataIdGroup,
          lastTweetIdGroup,
          tweetGroup,
        } = args.getState();
        return {
          listIds: [...listIds, listId],
          newestTweetDataIdGroup: { ...newestTweetDataIdGroup, [listId]: "0" },
          lastTweetIdGroup: { ...lastTweetIdGroup, [listId]: 0 },
          tweetGroup: { ...tweetGroup, [listId]: [] },
        };
      },
      callback,
    );
  },
  ADD_LISTIDS: () => async ({ callback, listId, dispatch }) => {
    await dispatchBlank(async () => {
      const asyncDispatch = makeAsyncDispatch(dispatch);
      const isSucess = await asyncDispatch({
        type: "ADD_LISTIDS_BASE",
        listId,
      });
      if (isSucess) await asyncDispatch({ type: "WRITE_CONFIG" });
    }, callback);
  },
  DELETE_LISTIDS_BASE: (args) => async ({ listId, callback }) => {
    await manageDispatch(
      args,
      async () => {
        const {
          listIds,
          newestTweetDataIdGroup,
          tweetGroup,
          lastTweetIdGroup,
        } = args.getState();
        const newListIds = listIds.filter((e) => e !== listId);
        const newNewestTweetDataIdGroup = omit(newestTweetDataIdGroup, listId);
        const newTweetGroup = omit(tweetGroup, listId);
        const newLastTweetIdGroup = omit(lastTweetIdGroup, listId);
        return {
          listIds: newListIds,
          newestTweetDataIdGroup: newNewestTweetDataIdGroup,
          tweetGroup: newTweetGroup,
          lastTweetIdGroup: newLastTweetIdGroup,
        };
      },
      callback,
    );
  },
  DELETE_LISTIDS: () => async ({ dispatch, listId, callback }) => {
    await dispatchBlank(async () => {
      const asyncDispatch = makeAsyncDispatch(dispatch);
      const isSucess = await asyncDispatch({
        type: "DELETE_LISTIDS_BASE",
        listId,
      });
      if (isSucess) await asyncDispatch({ type: "WRITE_CONFIG" });
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
      lastTweetIdGroup: {},
      tweetGroup: {},
      newestTweetDataIdGroup: {},
      listIds: [],
      currentList: undefined,
      limitData: { lists: { limitRate: 0, remaining: 0 } },
    } as State,
    asyncReducer,
  );
  useEffect(() => {
    dispatch({ type: "INITIALIZE" });
  }, [dispatch]);
  return [state, dispatch] as const;
};

export const { Provider, useTracked, useUpdate } = createContainer(useValue);
