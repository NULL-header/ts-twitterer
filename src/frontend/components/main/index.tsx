import React from "react";
import { HiOutlineCog, HiOutlineCube, HiOutlineHome } from "react-icons/hi";
import { TabGroup } from "frontend/components/ScreenContainer/TabContainer";
import { ScreenContainer } from "../ScreenContainer";
import { Timeline } from "./Timeline";
import { Config } from "./Config";
import { Data } from "./Data";

const tabs = {
  Timeline: { Component: Timeline, Icon: HiOutlineHome },
  Config: { Component: Config, Icon: HiOutlineCog },
  Data: { Component: Data, Icon: HiOutlineCube },
} as TabGroup;

export const Component = React.memo(() => <ScreenContainer tabs={tabs} />);
