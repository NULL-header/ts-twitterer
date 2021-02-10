/* eslint-disable camelcase */
import { useEffect, Dispatch } from "react";
import { createContainer } from "react-tracked";
import { db } from "../db";
import { useReducerAsync } from "use-reducer-async";
import { getTweets, loadNewTweetGroup } from "./tweets";
import { makeConfigColumns } from "./config";
import { initialize } from "./initialize";
import { deleteCacheTweets } from "./delete";
import {
  State,
  Flags,
  Action,
  GlobalAsyncReducer,
  GlobalReducer,
  AsyncDispatch,
  AsyncAction,
} from "./types";

const reducer: GlobalReducer = (state, action) => {
  switch (action.type) {
    case "MODIFY": {
      return { ...state, ...action.state };
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
  callback: (arg: boolean) => void
) => {
  return await process().catch((err) => {
    // eslint-disable-next-line standard/no-callback-literal
    callback(false);
    console.log(err);
    return undefined;
  });
};

const dispatchBlank = async (
  process: () => Promise<void>,
  callback?: (arg: boolean) => void
) => {
  const sendResult = makeSendResult(callback);
  await runWithCallback(process, sendResult);
  sendResult(true);
};

const adjustFlag = async (
  flagName: keyof Flags,
  { dispatch, signal, getState }: ReducerArgs,
  process: () => Promise<Partial<State> | undefined>,
  callback?: (arg: boolean) => void
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

const makeSendResult = (
  callback: (isSucess: boolean) => void = (_arg: boolean) => {
    return;
  }
) => {
  return callback;
};

const makeAsyncDispatch = (
  dispatch: AsyncDispatch
): ((arg: AsyncAction) => Promise<boolean>) => {
  return (args: AsyncAction) =>
    new Promise((resolve) => dispatch({ callback: resolve, ...args }));
};

const asyncReducer: GlobalAsyncReducer = {
  LOAD_NEW_TWEETS_BASE: (args) => async (action) => {
    await adjustFlag(
      "isLoadingTweets",
      args,
      async () => await loadNewTweetGroup(args.getState),
      action.callback
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
      action.callback
    );
  },
  GET_TWEETS: () => async (action) => {
    await dispatchBlank(async () => {
      const dispatch = makeAsyncDispatch(action.dispatch);
      const isSuccessGetting = await dispatch({ type: "GET_TWEETS_BASE" });
      console.log("get tweet");
      console.log({ isSuccessGetting });
      if (isSuccessGetting) await dispatch({ type: "WRITE_CONFIG" });
    }, action.callback);
  },
  DELETE_CACHE_TWEETS: (args) => async () => {
    await adjustFlag(
      "isDeletingTweets",
      args,
      async () => await deleteCacheTweets(args.getState)
    );
  },
  DELETE_CACHE_CONFIG: (args) => async () => {
    await adjustFlag("isDeletingConfigs", args, async () => {
      await db.configs.clear();
      return { lastTweetIdGroup: {}, newestTweetDataIdGroup: {} };
    });
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
      action.callback
    );
  },
};

const useValue = () => {
  const [state, dispatch] = useReducerAsync(
    reducer,
    {
      isLoadingTweets: false,
      isSettingTweets: false,
      isGettingTweets: false,
      isDeletingTweets: false,
      isDeletingConfigs: false,
      isUpdatingTweets: false,
      isWritingConfig: false,
      lastTweetIdGroup: {},
      tweetGroup: {},
      newestTweetDataIdGroup: {},
      listIds: [],
      currentList: "",
      limitData: { lists: { limitRate: 0, remaining: 0 } },
    } as State,
    asyncReducer
  );
  useEffect(() => {
    dispatch({ type: "INITIALIZE" });
  }, [dispatch]);
  return [state, dispatch] as const;
};

export const { Provider, useSelector, useUpdate } = createContainer(useValue);
