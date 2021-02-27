import React, { useReducer, Reducer, Dispatch } from "react";
import { Data } from "../Data";
import { TimeLine } from "../TimeLine";
import { Config } from "../Config";
import { ListSelector } from "../ListSelector";
// exported things are type only
// eslint-disable-next-line import/no-cycle
import { SideBar } from "./SideBar";
import { useStyles } from "./style";

export type TabNames = "TIMELINE" | "CONFIG" | "DATA";

type Action = { type: "CHANGE_TAB"; tab: TabNames };

type Screens = Record<TabNames, React.FC>;

export type ScreenDispatch = Dispatch<Action>;

interface State {
  CurrentScreen: Screens[keyof Screens];
}

const screens: Screens = {
  TIMELINE: TimeLine,
  CONFIG: Config,
  DATA: Data,
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
    default: {
      throw new Error("An error occurred in the changing tabs");
    }
  }
};

export const ScreenContainer: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initValue);
  const classes = useStyles();
  return (
    <div className={classes.root} role="main">
      <SideBar dispatch={dispatch} />
      <div>
        <state.CurrentScreen />
        <ListSelector />
      </div>
    </div>
  );
};
