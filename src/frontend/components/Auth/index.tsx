import React from "react";
import { TabGroup } from "../TabContainer";
import { ScreenContainer } from "../ScreenContainer";
import { AuthForm } from "./Auth";
import { HiOutlineCog, HiOutlineHome } from "./icon";
import { Config } from "./Config";

const tabs = {
  Auth: { Component: AuthForm, Icon: HiOutlineHome },
  Config: { Component: Config, Icon: HiOutlineCog },
} as TabGroup;

export const Component = React.memo(() => <ScreenContainer tabs={tabs} />);
