import React, { useReducer, Reducer, Dispatch } from "react";
import { TimeLine, Config, ListSelector } from "..";
import { SideBar } from "./SideBar";
import { useStyles } from "./style";

export type TabNames = "TIMELINE" | "CONFIG";

type Action = { type: "CHANGE_TAB"; tab: TabNames };

type Screens = Record<TabNames, React.FC>;

export type ScreenDispatch = Dispatch<Action>;

interface State {
  CurrentScreen: Screens[keyof Screens];
}

const screens: Screens = {
  TIMELINE: TimeLine,
  CONFIG: Config,
} as const;

const initValue: State = {
  CurrentScreen: screens.TIMELINE,
};

const reducer: Reducer<State, Action> = (_state, action) => {
  switch (action.type) {
    case "CHANGE_TAB": {
      const CurrentScreen = screens[action.tab];
      return { CurrentScreen };
    }
  }
};

export const ScreenContainer: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initValue);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <SideBar dispatch={dispatch} />
      <div>
        <state.CurrentScreen />
        <ListSelector />
      </div>
    </div>
  );
};
