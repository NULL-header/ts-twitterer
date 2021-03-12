/* eslint-disable camelcase */
import { Dispatch } from "react";
import { createContainer } from "react-tracked";
import { useReducerAsync } from "use-reducer-async";
import { useMount } from "react-use";
import Immutable from "immutable";
import {
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
import { TweetsDetail } from "./models/tweetsDetail";

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

const manageDispatch = async (
  { dispatch, signal }: ReducerArgs,
  effect: () => Promise<Partial<State>>,
) => {
  const result = await effect();
  if (signal.aborted) return;
  dispatch({ type: "MODIFY", state: result });
};

const adjustFlag = async (
  flagName: keyof Flags,
  { dispatch, signal, getState }: ReducerArgs,
  effect: () => Promise<Partial<State> | undefined>,
) => {
  const currentFlag = getState()[flagName];
  if (currentFlag) {
    return;
  }
  dispatch({ type: "MODIFY", state: { [flagName]: true } });
  const result = (await effect()) || {};
  if (signal.aborted) return;
  dispatch({ type: "MODIFY", state: { ...result, [flagName]: false } });
};

const asyncReducer: GlobalAsyncReducer = {
  LOAD_NEW_TWEETS: (args) => async () =>
    await adjustFlag("isLoadingTweets", args, async () => {
      const { currentList, tweetsDetail } = args.getState();
      return await loadNewTweets({
        currentList,
        tweetsDetailObj: tweetsDetail.toJS(),
      });
    }),
  INITIALIZE: (args) => async () =>
    await adjustFlag("isInitializing", args, async () => {
      try {
        const lastData = ((await initialize()) as any) as State;

        if (lastData.tweetsDetail != null)
          lastData.tweetsDetail = args
            .getState()
            .tweetsDetail.load(lastData.tweetsDetail);
        return lastData;
      } catch (e) {}
    }),
  GET_TWEETS: (args) => async () =>
    await adjustFlag("isGettingTweets", args, async () => {
      const { listIds, limitData, tweetsDetail } = args.getState();
      const obj = await saveTweets({
        listIds,
        limitData,
        newestDataidMapObj: tweetsDetail.newestDataidMap.toJS(),
      });
      return {
        tweetsDetail: tweetsDetail.set("newestDataidMap", Immutable.Map(obj)),
      };
    }),
  DELETE_CACHE_TWEETS: (args) => async () =>
    await adjustFlag("isDeletingTweets", args, async () => {
      const { tweetsDetail } = args.getState();
      const result = await deleteCacheTweetsAll({
        tweetsDetailObj: tweetsDetail.toJS(),
      });
      return { tweetsDetail: tweetsDetail.load(result) };
    }),
  DELETE_CACHE_CONFIG: (args) => async () =>
    await adjustFlag("isDeletingConfigs", args, async () => {
      const { tweetsDetail } = args.getState();
      const { nextState, tweetsDetailObj } = await deleteCacheConfig();
      return { ...nextState, tweetsDetail: tweetsDetail.load(tweetsDetailObj) };
    }),
  WRITE_CONFIG: (args) => async () =>
    await adjustFlag("isWritingConfig", args, async () => {
      const state = args.getState();
      console.log(state);
      saveConfigs(state);
      return undefined;
    }),
  GET_RATE: (args) => async () =>
    await manageDispatch(args, async () => {
      const response = await fetch(CONSTVALUE.GET_RATE_URL);
      const limitData = (await response.json()) as LimitData;
      return { limitData };
    }),
  ADD_LISTIDS: (args) => async ({ listId }) =>
    await manageDispatch(args, async () => {
      const { listIds } = args.getState();
      return {
        listIds: [...listIds, listId],
      } as State;
    }),
  DELETE_LISTIDS: (args) => async ({ listId }) => {
    await manageDispatch(args, async () => {
      const { listIds } = args.getState();
      const newListIds = listIds.filter((e) => e !== listId);
      return {
        listIds: newListIds,
      };
    });
  },
  AUTHORISE: ({ getState, dispatch }) => async () => {
    const { isAuthorized } = getState();
    dispatch({ type: "MODIFY", state: { isAuthorized: !isAuthorized } });
  },
};

const iniitalValue: State = {
  isLoadingTweets: false,
  isGettingTweets: false,
  isDeletingTweets: false,
  isDeletingConfigs: false,
  isUpdatingTweets: false,
  isWritingConfig: false,
  isInitializing: undefined,
  listIds: [],
  currentList: undefined,
  limitData: undefined,
  isAuthorized: false,
  tweetsDetail: new TweetsDetail(),
};

console.log(new TweetsDetail());

const useValue = () => {
  const [state, dispatch] = useReducerAsync<
    GlobalReducer,
    AsyncAction,
    AsyncAction | Action
  >(reducer, iniitalValue, asyncReducer);
  useMount(() => {
    dispatch({ type: "INITIALIZE" });
  });

  return [state, dispatch] as const;
};

export const { Provider, useTracked, useUpdate, useSelector } = createContainer(
  useValue,
);
