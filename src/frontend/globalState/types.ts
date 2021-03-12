import { Dispatch, Reducer } from "react";
import { AsyncActionHandlers } from "use-reducer-async";
import { TweetsDetail } from "./models/tweetsDetail";

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
  tweetsDetail: TweetsDetail;
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
