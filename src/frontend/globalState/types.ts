import { Dispatch, Reducer } from "react";
import { AsyncActionHandlers } from "use-reducer-async";

export type Flags = {
  isLoadingTweets: boolean;
  isGettingTweets: boolean;
  isInitializing?: boolean;
  isDeletingTweets: boolean;
  isDeletingConfigs: boolean;
  isUpdatingTweets: boolean;
  isWritingConfig: boolean;
};

type AppData = {
  tweetGroup: Record<string, Tweet[]>;
};

export type State = Flags & Configs & AppData;

export type Action = { type: "MODIFY"; state: Partial<State> };
export type AsyncDispatch = Dispatch<Action | AsyncAction>;

export type AsyncAction = { callback?: (isSuccess: boolean) => void } & (
  | { type: "LOAD_NEW_TWEETS_BASE" }
  | { type: "LOAD_NEW_TWEETS"; dispatch: AsyncDispatch }
  | { type: "GET_TWEETS_BASE" }
  | { type: "GET_TWEETS"; dispatch: AsyncDispatch }
  | { type: "INITIALIZE" }
  | { type: "DELETE_CACHE_TWEETS" }
  | { type: "DELETE_CACHE_CONFIG" }
  | { type: "UPDATE_TWEETS"; dispatch: AsyncDispatch }
  | { type: "WRITE_CONFIG" }
);
export type GlobalReducer = Reducer<State, Action>;
export type GlobalAsyncReducer = AsyncActionHandlers<
  GlobalReducer,
  AsyncAction
>;
