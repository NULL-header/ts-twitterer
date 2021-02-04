/* eslint-disable camelcase */
import { Reducer, useEffect, Dispatch } from "react";
import { createContainer } from "react-tracked";
import { db } from "../db";
import { AsyncActionHandlers, useReducerAsync } from "use-reducer-async";
import { loadNewTweets, loadOldTweets } from "./loadTweets";
import { getTweetLows } from "./getTweetLows";

type Flags = {
  isLoadingTweets: boolean;
  isGettingTweets: boolean;
  isInitializing?: boolean;
  isDeletingTweets: boolean;
  isDeletingConfigs: boolean;
  isUpdatingTweets: boolean;
  isWritingConfig: boolean;
};

type AppData = {
  tweets: Tweet[];
};

type State = Flags & Configs & AppData;

type Action = { type: "MODIFY"; state: Partial<State> };
type AsyncAction =
  // this callback is to use dispatch continuously.
  | { type: "LOAD_NEW_TWEETS"; callback?: (isSuccess: boolean) => void }
  | { type: "GET_TWEETS"; callback?: (isSuccess: boolean) => void }
  | { type: "INITIALIZE" }
  | { type: "DELETE_CACHE_TWEETS" }
  | { type: "DELETE_CACHE_CONFIG" }
  | { type: "UPDATE_TWEETS"; dispatch: Dispatch<Action | AsyncAction> }
  | { type: "WRITE_CONFIG" };
type GlobalReducer = Reducer<State, Action>;
type GlobalAsyncReducer = AsyncActionHandlers<GlobalReducer, AsyncAction>;

const reducer: GlobalReducer = (state, action) => {
  switch (action.type) {
    case "MODIFY": {
      return { ...state, ...action.state };
    }
  }
};

const makeConfigLow = (state: State): ConfigColumns => {
  const {
    lastTweetId: last_tweet_id,
    newestTweetDataId: newest_tweet_data_id,
  } = state;
  return { last_tweet_id, newest_tweet_data_id, id: 0 };
};

const adjustFlag = async (
  flagName: keyof Flags,
  { dispatch, signal }: { dispatch: Dispatch<Action>; signal: AbortSignal },
  process: () => Promise<Partial<State> | undefined>
) => {
  dispatch({ type: "MODIFY", state: { [flagName]: true } });
  const result = (await process()) || {};
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

const asyncReducer: GlobalAsyncReducer = {
  LOAD_NEW_TWEETS: ({ dispatch, signal, getState }) => async (action) => {
    const { lastTweetId, tweets: oldTweets, isLoadingTweets } = getState();
    const sendResult = makeSendResult(signal, action.callback);
    if (isLoadingTweets) {
      sendResult(false);
      return;
    }
    adjustFlag("isLoadingTweets", { dispatch, signal }, async () => {
      const tweets = await loadNewTweets(lastTweetId);
      if (tweets.length === 0) {
        sendResult(false);
        return;
      }
      const nextLastTweetId = tweets[tweets.length - 1].id;
      sendResult(true);
      return {
        tweets: [...oldTweets, ...tweets],
        lastTweetId: nextLastTweetId,
      };
    });
  },
  INITIALIZE: ({ dispatch, signal }) => async () => {
    adjustFlag("isInitializing", { dispatch, signal }, async () => {
      const configsNullable = await db.configs.get(0);
      const configs =
        configsNullable || ({ last_tweet_id: 0 } as ConfigColumns);
      const lastTweets = await loadOldTweets(configs.last_tweet_id);
      return {
        tweets: lastTweets,
        lastTweetId: configs.last_tweet_id,
      };
    });
  },
  GET_TWEETS: ({ dispatch, signal, getState }) => async (action) => {
    const {
      newestTweetDataId: lastNewestTweetDataId,
      isGettingTweets,
    } = getState();
    const sendResult = makeSendResult(signal, action.callback);
    if (isGettingTweets) {
      sendResult(false);
      return;
    }
    adjustFlag("isGettingTweets", { dispatch, signal }, async () => {
      const tweetLows = await getTweetLows(lastNewestTweetDataId);
      if (tweetLows.length === 0) {
        sendResult(false);
        return;
      }
      console.log({ tweetLows });
      await db.tweets.bulkAdd(tweetLows as any);
      const nextNewestTweetDataId = tweetLows[tweetLows.length - 1].dataid;
      sendResult(true);
      return { newestTweetDataId: nextNewestTweetDataId };
    });
  },
  DELETE_CACHE_TWEETS: (args) => async () => {
    adjustFlag("isDeletingTweets", args, async () => {
      await db.tweets.clear();
      return { tweets: [] };
    });
  },
  DELETE_CACHE_CONFIG: (args) => async () => {
    adjustFlag("isDeletingConfigs", args, async () => {
      await db.configs.clear();
      return { lastTweetId: 0, newestTweetDataId: 0 };
    });
  },
  UPDATE_TWEETS: (args) => async (action) => {
    adjustFlag("isUpdatingTweets", args, async () => {
      const isSuccessGetting = await new Promise((resolve) =>
        action.dispatch({ type: "GET_TWEETS", callback: resolve as any })
      );
      if (isSuccessGetting)
        await new Promise((resolve) =>
          action.dispatch({ type: "LOAD_NEW_TWEETS", callback: resolve as any })
        );
      return undefined;
    });
  },
  WRITE_CONFIG: (args) => async () => {
    const configLow = makeConfigLow(args.getState());
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
      lastTweetId: 0,
      tweets: [],
      newestTweetDataId: 0,
    } as State,
    asyncReducer
  );
  useEffect(() => {
    dispatch({ type: "INITIALIZE" });
  }, [dispatch]);
  return [state, dispatch] as const;
};

export const { Provider, useSelector, useUpdate } = createContainer(useValue);
