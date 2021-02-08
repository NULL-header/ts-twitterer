import React from "react";
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
    Component: () => <div>timeline</div>,
  },
  {
    name: "CONFIG",
    Component: () => <div>config</div>,
  },
];

export const SideBar: React.FC<Props> = React.memo((props) => {
  return (
    <div>
      {tabButtons.map((btn) => (
        <div
          key={btn.name}
          onClick={() => props.dispatch({ type: "CHANGE_TAB", tab: btn.name })}
        >
          <btn.Component />
        </div>
      ))}
    </div>
  );
});
