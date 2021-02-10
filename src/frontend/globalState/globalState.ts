/* eslint-disable camelcase */
import { useEffect, Dispatch } from "react";
import { createContainer } from "react-tracked";
import { db } from "../db";
import { useReducerAsync } from "use-reducer-async";
import { getTweets, loadNewTweetGroup } from "./tweets";
import { makeConfigColumns } from "./config";
import { initialize } from "./initialize";
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

const adjustFlag = async (
  flagName: keyof Flags,
  { dispatch, signal, getState }: ReducerArgs,
  process: () => Promise<Partial<State> | undefined>,
  callback?: (arg: boolean) => void
) => {
  const sendResult = makeSendResult(signal, callback);
  const currentFlag = getState()[flagName];
  if (currentFlag) {
    sendResult(true);
    return;
  }
  dispatch({ type: "MODIFY", state: { [flagName]: true } });
  const result =
    (await process()
      .then((res) => {
        sendResult(true);
        return res;
      })
      .catch((err) => {
        sendResult(false);
        console.log(err);
      })) || {};
  if (signal.aborted) return;
  dispatch({ type: "MODIFY", state: { ...result, [flagName]: false } });
};

const makeSendResult = (
  signal: AbortSignal,
  callback: (isSucess: boolean) => void = (_arg: boolean) => {
    return;
  }
) => {
  return (arg: boolean) => {
    if (signal.aborted) return;
    callback(arg);
  };
};

const makeAsyncDispatch = (dispatch: AsyncDispatch) => {
  return (args: AsyncAction) =>
    new Promise((resolve) => dispatch({ callback: resolve, ...args }));
};

const asyncReducer: GlobalAsyncReducer = {
  LOAD_NEW_TWEETS: (args) => async (action) => {
    adjustFlag(
      "isLoadingTweets",
      args,
      async () => await loadNewTweetGroup(args.getState),
      action.callback
    );
  },
  INITIALIZE: (args) => async () => {
    adjustFlag("isInitializing", args, async () => await initialize());
  },
  GET_TWEETS: (args) => async (action) => {
    adjustFlag(
      "isGettingTweets",
      args,
      async () => await getTweets(args.getState),
      action.callback
    );
  },
  DELETE_CACHE_TWEETS: (args) => async () => {
    adjustFlag("isDeletingTweets", args, async () => {
      await db.tweets.clear();
      return { tweetGroup: {} };
    });
  },
  DELETE_CACHE_CONFIG: (args) => async () => {
    adjustFlag("isDeletingConfigs", args, async () => {
      await db.configs.clear();
      return { lastTweetIdGroup: {}, newestTweetDataIdGroup: {} };
    });
  },
  UPDATE_TWEETS: (args) => async (action) => {
    adjustFlag("isUpdatingTweets", args, async () => {
      const dispatch = makeAsyncDispatch(action.dispatch);
      const isSuccessGetting = await dispatch({ type: "GET_TWEETS" });
      if (isSuccessGetting) await dispatch({ type: "LOAD_NEW_TWEETS" });
      return undefined;
    });
  },
  WRITE_CONFIG: (args) => async () => {
    const configLow = makeConfigColumns(args.getState());
    adjustFlag("isWritingConfig", args, async () => {
      await db.configs.put(configLow);
      return undefined;
    });
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
