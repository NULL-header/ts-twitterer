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
type AsyncAction =
  // this callback is to use dispatch continuously.
  | { type: "LOAD_NEW_TWEETS"; callback?: (isSuccess: boolean) => void }
  | {
      type: "GET_TWEETS";
      callback?: (isSuccess: boolean) => void;
    }
  | { type: "INITIALIZE" }
  | { type: "DELETE_CACHE_TWEETS" }
  | { type: "DELETE_CACHE_CONFIG" }
  | { type: "UPDATE_TWEETS"; dispatch: Dispatch<Action | AsyncAction> }
  | { type: "WRITE_CONFIG" };
export type GlobalReducer = Reducer<State, Action>;
export type GlobalAsyncReducer = AsyncActionHandlers<
  GlobalReducer,
  AsyncAction
>;
