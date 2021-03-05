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

export type AsyncAction = { callback?: (isSuccess: boolean) => void } & (
  | { type: "LOAD_NEW_TWEETS_BASE" }
  | { type: "LOAD_NEW_TWEETS"; dispatch: AsyncDispatch }
  | { type: "GET_TWEETS_BASE" }
  | { type: "GET_TWEETS"; dispatch: AsyncDispatch }
  | { type: "INITIALIZE" }
  | { type: "DELETE_CACHE_TWEETS" }
  | { type: "DELETE_CACHE_CONFIG" }
  | { type: "GET_TWEETS_OF_CURRENT_BASE" }
  | { type: "GET_TWEETS_OF_CURRENT"; dispatch: AsyncDispatch }
  | { type: "UPDATE_TWEETS"; dispatch: AsyncDispatch }
  | { type: "WRITE_CONFIG" }
  | { type: "GET_RATE" }
  | { type: "ADD_LISTIDS_BASE"; listId: string }
  | { type: "ADD_LISTIDS"; listId: string; dispatch: AsyncDispatch }
  | { type: "DELETE_LISTIDS_BASE"; listId: string }
  | { type: "DELETE_LISTIDS"; listId: string; dispatch: AsyncDispatch }
);

export type GlobalReducer = Reducer<State, Action>;
export type GlobalAsyncReducer = AsyncActionHandlers<
  GlobalReducer,
  AsyncAction
>;
