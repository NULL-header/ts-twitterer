import React from "react";
// imported things are types only
// eslint-disable-next-line import/no-cycle
import { ScreenDispatch, TabNames } from "./ScreenContainer";

interface Props {
  dispatch: ScreenDispatch;
}

interface TabButton {
  name: TabNames;
  Component: React.FC;
}

const tabButtons: TabButton[] = [
  {
    name: "TIMELINE",
    Component: () => <div aria-label="timelineTab">timeline</div>,
  },
  {
    name: "CONFIG",
    Component: () => <div aria-label="configTab">config</div>,
  },
  {
    name: "DATA",
    Component: () => <div aria-label="dataTab">data</div>,
  },
];

export const SideBar: React.FC<Props> = React.memo((props) => (
  <div role="tablist">
    {tabButtons.map((btn) => (
      <button
        key={btn.name}
        onClick={() => props.dispatch({ type: "CHANGE_TAB", tab: btn.name })}
        type="button"
        role="tab"
      >
        <btn.Component />
      </button>
    ))}
  </div>
));
