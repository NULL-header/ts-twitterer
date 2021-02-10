/* eslint-disable camelcase */
import { useEffect, Dispatch } from "react";
import { createContainer } from "react-tracked";
import { db } from "../db";
import { useReducerAsync } from "use-reducer-async";
import { loadNewTweets, loadOldTweets } from "./loadTweets";
import { getTweetLows } from "./getTweetLows";
import { loadConfigs, makeConfigColumns } from "./configs";
import {
  State,
  Flags,
  Action,
  GlobalAsyncReducer,
  GlobalReducer,
} from "./types";

const reducer: GlobalReducer = (state, action) => {
  switch (action.type) {
    case "MODIFY": {
      return { ...state, ...action.state };
    }
  }
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
    const {
      lastTweetIdGroup: oldLastTweetIdGroup,
      tweetGroup: oldTweetGroup,
      isLoadingTweets,
      listIds,
    } = getState();
    const sendResult = makeSendResult(signal, action.callback);
    if (isLoadingTweets) {
      sendResult(false);
      return;
    }
    adjustFlag("isLoadingTweets", { dispatch, signal }, async () => {
      console.log("start load");
      const tweetsArray = await Promise.all(
        listIds.map((listId) =>
          loadNewTweets(oldLastTweetIdGroup[listId], listId)
        )
      );
      console.log({ tweetsArray });
      let count = 0;
      const { lastTweetIdGroup, tweetGroup } = listIds.reduce(
        (a, listId, i) => {
          const current = tweetsArray[i];
          if (current.length === 0) {
            a.tweetGroup[listId] = oldTweetGroup[listId];
            a.lastTweetIdGroup[listId] = oldLastTweetIdGroup[listId];
            return a;
          }
          count++;
          console.log(oldTweetGroup);
          a.tweetGroup[listId] = [...oldTweetGroup[listId], ...current];
          a.lastTweetIdGroup[listId] = current[current.length - 1].id;
          return a;
        },
        { tweetGroup: {}, lastTweetIdGroup: {} } as {
          tweetGroup: Record<string, Tweet[]>;
          lastTweetIdGroup: Record<string, number>;
        }
      );
      sendResult(true);
      return count === 0
        ? {}
        : {
            tweetGroup,
            lastTweetIdGroup,
          };
    });
  },
  INITIALIZE: ({ dispatch, signal }) => async () => {
    adjustFlag("isInitializing", { dispatch, signal }, async () => {
      const config = await loadConfigs();
      if (config == null) return;
      const oldTweetsArray = await Promise.all(
        config.listIds.map((listId) =>
          loadOldTweets(config.lastTweetIdGroup[listId], listId)
        )
      );
      const oldTweetGroup = config.listIds.reduce((a, listId, i) => {
        a[listId] = oldTweetsArray[i];
        return a;
      }, {} as Record<string, Tweet[]>);
      return { ...config, tweetGroup: oldTweetGroup };
    });
  },
  GET_TWEETS: ({ dispatch, signal, getState }) => async (action) => {
    const {
      newestTweetDataIdGroup: lastNewestTweetDataIdGroup,
      isGettingTweets,
      listIds,
    } = getState();
    console.log({ lastNewestTweetDataIdGroup, isGettingTweets, listIds });
    const sendResult = makeSendResult(signal, action.callback);
    if (isGettingTweets || listIds.length === 0) {
      sendResult(false);
      return;
    }
    adjustFlag("isGettingTweets", { dispatch, signal }, async () => {
      const tweetLowsArray = await Promise.all(
        listIds.map((listId) =>
          getTweetLows(lastNewestTweetDataIdGroup[listId], listId)
        )
      );
      const tweetLows = tweetLowsArray.flat();
      if (tweetLows.length === 0) {
        sendResult(false);
        return;
      }
      console.log({ tweetLows });
      await db.tweets.bulkAdd(tweetLows as any);
      const newestTweetDataIdGroup = listIds.reduce((a, listId, i) => {
        const current = tweetLowsArray[i];
        a[listId] = current[current.length - 1].dataid;
        return a;
      }, {} as Record<string, string>);
      sendResult(true);
      return { newestTweetDataIdGroup };
    });
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
