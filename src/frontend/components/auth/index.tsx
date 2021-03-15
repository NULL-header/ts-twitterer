import React from "react";
import { HiOutlineCog, HiOutlineKey } from "react-icons/hi";
import { TabGroup } from "frontend/components/ScreenContainer/TabContainer";
import { ScreenContainer } from "../ScreenContainer";
import { Auth } from "./Auth";
import { Config } from "./Config";

const tabs = {
  Auth: { Component: Auth, Icon: HiOutlineKey },
  Config: { Component: Config, Icon: HiOutlineCog },
} as TabGroup;

export const Component = React.memo(() => <ScreenContainer tabs={tabs} />);
