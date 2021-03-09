import React from "react";
import { TabGroup } from "../TabContainer";
import { ScreenContainer } from "../ScreenContainer";
import { Timeline } from "./TimeLine";
import { Config } from "./Config";
import { Data } from "./Data";
import { HiOutlineCog, HiOutlineCube, HiOutlineHome } from "./icons";

const tabs = {
  Timeline: { Component: Timeline, Icon: HiOutlineHome },
  Config: { Component: Config, Icon: HiOutlineCog },
  Data: { Component: Data, Icon: HiOutlineCube },
} as TabGroup;

export const Component = React.memo(() => <ScreenContainer tabs={tabs} />);
