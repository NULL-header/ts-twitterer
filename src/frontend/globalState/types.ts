import { Dispatch, Reducer } from "react";
import { AsyncActionHandlers } from "use-reducer-async";

export type Flags = {
  isLoadingTweets: boolean;
  isGettingTweets: boolean;
  isInitializing: boolean | undefined;
  isDeletingTweets: boolean;
  isDeletingConfigs: boolean;
  isUpdatingTweets: boolean;
  isWritingConfig: boolean;
};

type AppData = {
  tweets: Tweet[];
};

export type State = Flags & Configs & AppData;

export type Action = { type: "MODIFY"; state: Partial<State> };
export type AsyncDispatch = Dispatch<Action | AsyncAction>;

export type AsyncAction =
  | { type: "LOAD_NEW_TWEETS" }
  | { type: "GET_TWEETS" }
  | { type: "INITIALIZE" }
  | { type: "DELETE_CACHE_TWEETS" }
  | { type: "DELETE_CACHE_CONFIG" }
  | { type: "GET_TWEETS_OF_CURRENT" }
  | { type: "WRITE_CONFIG" }
  | { type: "GET_RATE" }
  | { type: "ADD_LISTIDS"; listId: string }
  | { type: "DELETE_LISTIDS"; listId: string }
  | {
      type: "AUTHORISE";
    };

export type GlobalReducer = Reducer<State, Action>;
export type GlobalAsyncReducer = AsyncActionHandlers<
  GlobalReducer,
  AsyncAction
>;
