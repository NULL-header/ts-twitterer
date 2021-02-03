/* eslint-disable camelcase */
import { Reducer, useEffect, Dispatch } from "react";
import { createContainer } from "react-tracked";
import { db } from "./db";
import { AsyncActionHandlers, useReducerAsync } from "use-reducer-async";
import { CONSTVALUE } from "./CONSTVALUE";

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

const makeTweetLow = (tweetData: any): Omit<TweetColumns, "id"> => {
  const {
    text: content,
    id: dataid,
    created_at,
    user: { screen_name: userid, name: username, profile_image_url: icon_url },
  } = tweetData;
  return { content, dataid, created_at, userid, username, icon_url };
};
const makeTweet = (low: TweetColumns): Tweet => {
  const {
    content,
    created_at: createdAt,
    dataid,
    userid,
    username,
    icon_url: iconUrl,
    id,
  } = low;
  return {
    content,
    createdAt,
    dataid,
    username,
    userid,
    id,
    iconUrl,
  };
};

const getNewTweetData = async (lastNewestTweetDataId: number) => {
  const tweetResponse = await fetch(CONSTVALUE.GET_TWEETS_URL);
  console.log({ tweetResponse });
  const tweetData = (await tweetResponse.json()) as any[];
  const lastIndexOldTweetData = tweetData.findIndex(
    (e) => e.id === lastNewestTweetDataId
  );
  const newTweetData =
    lastIndexOldTweetData < 0
      ? tweetData
      : tweetData.slice(lastIndexOldTweetData + 1);

  return newTweetData;
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
  process: () => Promise<void>
) => {
  dispatch({ type: "MODIFY", state: { [flagName]: true } });
  await process();
  if (signal.aborted) return;
  dispatch({ type: "MODIFY", state: { [flagName]: false } });
};

const asyncReducer: GlobalAsyncReducer = {
  LOAD_NEW_TWEETS: ({ dispatch, signal, getState }) => async (action) => {
    const state = getState();
    const sendResult =
      action.callback ||
      ((_arg: boolean) => {
        return;
      });
    const lastTweetId = state.lastTweetId;
    const oldTweets = state.tweets;
    dispatch({ type: "MODIFY", state: { isLoadingTweets: true } });
    const newTweetLows = await db.tweets
      .where("id")
      .above(lastTweetId)
      .toArray();
    const newTweets = newTweetLows.map((e) => makeTweet(e));
    if (signal.aborted) return;
    else if (newTweets.length === 0) {
      dispatch({ type: "MODIFY", state: { isLoadingTweets: false } });
      sendResult(false);
      return;
    }
    const nextLastTweetId = newTweets[newTweets.length - 1].id;
    dispatch({
      type: "MODIFY",
      state: {
        tweets: [...oldTweets, ...newTweets],
        lastTweetId: nextLastTweetId,
        isLoadingTweets: false,
      },
    });
    sendResult(true);
  },
  INITIALIZE: ({ dispatch, signal }) => async () => {
    dispatch({ type: "MODIFY", state: { isInitializing: true } });
    const configsNullable = await db.configs.get(0);
    const configs = configsNullable || ({ last_tweet_id: 0 } as ConfigColumns);
    const lastTweetLows = await db.tweets
      .where("id")
      .below(configs.last_tweet_id)
      .toArray();
    if (signal.aborted) return;
    const lastTweets = lastTweetLows.map((e) => makeTweet(e));
    dispatch({
      type: "MODIFY",
      state: {
        isInitializing: false,
        tweets: lastTweets,
        lastTweetId: configs.last_tweet_id,
      },
    });
  },
  GET_TWEETS: ({ dispatch, signal, getState }) => async (action) => {
    const {
      newestTweetDataId: lastNewestTweetDataId,
      isGettingTweets,
    } = getState();
    const sendResult =
      action.callback ||
      ((_arg: boolean) => {
        return;
      });
    if (isGettingTweets) {
      sendResult(false);
      return;
    }
    dispatch({ type: "MODIFY", state: { isGettingTweets: true } });
    const newTweetData = await getNewTweetData(lastNewestTweetDataId);
    // It is to lose no got tweet data without writing to db.
    if (newTweetData.length === 0) {
      if (signal.aborted) return;
      dispatch({ type: "MODIFY", state: { isGettingTweets: false } });
      sendResult(false);
      return;
    }
    const tweetLows = newTweetData.map((e) => makeTweetLow(e));
    console.log({ tweetLows, newTweetData });
    // id is nothing in tweetLows, but it is generated by indexeddb
    await db.tweets.bulkAdd(tweetLows as any);
    if (signal.aborted) return;
    const nextNewestTweetDataId = tweetLows[tweetLows.length - 1].dataid;
    dispatch({
      type: "MODIFY",
      state: {
        isGettingTweets: false,
        newestTweetDataId: nextNewestTweetDataId,
      },
    });
    sendResult(true);
  },
  DELETE_CACHE_TWEETS: (args) => async () => {
    adjustFlag("isDeletingTweets", args, async () => db.tweets.clear());
  },
  DELETE_CACHE_CONFIG: (args) => async () => {
    adjustFlag("isDeletingConfigs", args, async () => db.configs.clear());
  },
  UPDATE_TWEETS: () => async (action) => {
    action.dispatch({ type: "MODIFY", state: { isUpdatingTweets: true } });
    const isSuccessGetting = await new Promise((resolve) =>
      action.dispatch({ type: "GET_TWEETS", callback: resolve as any })
    );
    if (isSuccessGetting)
      await new Promise((resolve) =>
        action.dispatch({ type: "LOAD_NEW_TWEETS", callback: resolve as any })
      );
    action.dispatch({ type: "MODIFY", state: { isUpdatingTweets: false } });
  },
  WRITE_CONFIG: (args) => async () => {
    adjustFlag("isWritingConfig", args, async () => {
      const configLow = makeConfigLow(args.getState());
      await db.configs.put(configLow);
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
