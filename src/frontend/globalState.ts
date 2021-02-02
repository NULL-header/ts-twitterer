/* eslint-disable camelcase */
import { Reducer, useEffect, Dispatch } from "react";
import { createContainer } from "react-tracked";
import { db } from "./db";
import { AsyncActionHandlers, useReducerAsync } from "use-reducer-async";

type State = {
  isLoadingTweets: boolean;
  isGettingTweets: boolean;
  isInitializing?: boolean;
  isDeletingTweets: boolean;
  isDeletingConfigs: boolean;
  isUpdatingTweets: boolean;
  tweets: Tweet[];
  lastTweetId: number;
  newestTweetDataId: number;
};

type Action = { type: "MODIFY"; state: Partial<State> };
type AsyncAction =
  // this callback is to use dispatch continuously.
  | { type: "LOAD_NEW_TWEETS"; callback?: () => void }
  | { type: "GET_TWEETS"; callback?: () => void }
  | { type: "INITIALIZE" }
  | { type: "DELETE_CACHE_TWEETS" }
  | { type: "DELETE_CACHE_CONFIG" }
  | { type: "UPDATE_TWEETS"; dispatch: Dispatch<Action | AsyncAction> };
type GlobalReducer = Reducer<State, Action>;
type GlobalAsyncReducer = AsyncActionHandlers<GlobalReducer, AsyncAction>;

const reducer: GlobalReducer = (state, action) => {
  switch (action.type) {
    case "MODIFY": {
      return { ...state, ...action.state };
    }
  }
};

const makeTweet = (tweetData: any): Tweet => {
  return {
    content: tweetData.text,
    iconUrl: tweetData.user.profile_image_url,
    userid: tweetData.user.screen_name,
    username: tweetData.user.name,
  } as any;
};

const getNewTweetData = async (lastNewestTweetDataId: number) => {
  const tweetResponse = await fetch("/api/sample");
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

const asyncReducer: GlobalAsyncReducer = {
  LOAD_NEW_TWEETS: ({ dispatch, signal, getState }) => async (action) => {
    const state = getState();
    const lastTweetId = state.lastTweetId;
    const oldTweets = state.tweets;
    dispatch({ type: "MODIFY", state: { isLoadingTweets: true } });
    const newTweets = await db.tweets.where("id").above(lastTweetId).toArray();
    if (signal.aborted) return;
    else if (newTweets.length === 0) {
      dispatch({ type: "MODIFY", state: { isLoadingTweets: false } });
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
    action.callback && action.callback();
  },
  INITIALIZE: ({ dispatch, signal }) => async () => {
    dispatch({ type: "MODIFY", state: { isInitializing: true } });
    const configsNullable = await db.configs.get(0);
    const configs = configsNullable || ({ last_tweet_id: 0 } as Config);
    const lastTweets = await db.tweets
      .where("id")
      .below(configs.last_tweet_id)
      .toArray();
    if (signal.aborted) return;
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
    const lastNewestTweetDataId = getState().newestTweetDataId;
    dispatch({ type: "MODIFY", state: { isGettingTweets: true } });
    const newTweetData = await getNewTweetData(lastNewestTweetDataId);
    // It is to lose no got tweet data without writing to db.
    if (newTweetData.length === 0) {
      if (signal.aborted) return;
      dispatch({ type: "MODIFY", state: { isGettingTweets: false } });
      return;
    }
    const tweets = newTweetData.map((e) => makeTweet(e));
    console.log({ tweets, newTweetData });
    await db.tweets.bulkAdd(tweets);
    if (signal.aborted) return;
    const nextNewestTweetDataId = newTweetData[newTweetData.length - 1].id;
    dispatch({
      type: "MODIFY",
      state: {
        isGettingTweets: false,
        newestTweetDataId: nextNewestTweetDataId,
      },
    });
    action.callback && action.callback();
  },
  DELETE_CACHE_TWEETS: ({ dispatch, signal }) => async () => {
    dispatch({ type: "MODIFY", state: { isDeletingTweets: true } });
    await db.tweets.clear();
    if (signal.aborted) return;
    dispatch({
      type: "MODIFY",
      state: {
        isDeletingTweets: false,
        tweets: [],
        // it is so bad, but it is needed for test.
        // it will be removed on production.
        newestTweetDataId: 0,
        lastTweetId: 0,
      },
    });
  },
  DELETE_CACHE_CONFIG: () => async () => {
    return;
  },
  UPDATE_TWEETS: () => async (action) => {
    action.dispatch({ type: "MODIFY", state: { isUpdatingTweets: true } });
    await new Promise((resolve) =>
      action.dispatch({ type: "GET_TWEETS", callback: resolve as any })
    );
    await new Promise((resolve) =>
      action.dispatch({ type: "LOAD_NEW_TWEETS", callback: resolve as any })
    );
    action.dispatch({ type: "MODIFY", state: { isUpdatingTweets: false } });
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
