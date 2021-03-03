import React, { useLayoutEffect } from "react";
import {
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Box,
  Text,
  Collapse,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { HiOutlineHome, HiOutlineCog, HiOutlineCube } from "react-icons/hi";
import { delayCall, useBool } from "frontend/util";
import { Data } from "./Data";
import { Timeline } from "./TimeLine";
import { Config } from "./Config";
import { ListSelector } from "./ListSelector";
import { UpdateButton } from "./ForDev";

const tabs = {
  Timeline: { Component: Timeline, Icon: HiOutlineHome },
  Config: { Component: Config, Icon: HiOutlineCog },
  Data: { Component: Data, Icon: HiOutlineCube },
} as Record<string, { Component: React.FC; Icon: React.FC }>;

const useWindowWidthEffect = (effect: () => void) => {
  useLayoutEffect(() => {
    const handler = delayCall(() => {
      effect();
    });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  });
};

const AllTab = () => {
  const [isShow, show, hide] = useBool(true);
  const manageResize = () => {
    if (window.innerWidth > 500) {
      show();
    } else {
      hide();
    }
  };
  useWindowWidthEffect(manageResize);
  useLayoutEffect(() => {
    manageResize();
  }, []);

  return (
    <>
      {Object.keys(tabs).map((e) => (
        <Tab
          borderRightWidth="2px"
          borderLeftWidth="0px"
          marginRight="-2px"
          marginLeft="0px"
          padding="1vw 1.5vw"
          justifyContent="right"
          key={e}
        >
          <Icon as={tabs[e].Icon} boxSize="8" />
          <Collapse in={isShow} animateOpacity>
            <Text>{e}</Text>
          </Collapse>
        </Tab>
      ))}
    </>
  );
};

const ScreenContainer = () => (
  <>
    <Box
      role="main"
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      padding="2vw"
    >
      <Tabs
        orientation="vertical"
        flexGrow={1}
        display="flex"
        // this line is needed because the scroll system is broken if
        // it is removed.
        overflow="hidden"
      >
        <TabList
          marginBottom="auto"
          borderRightWidth="2px"
          borderLeftWidth="0px"
        >
          <AllTab />
        </TabList>
        <TabPanels height="100%">
          {Object.keys(tabs).map((e) => {
            const { Component } = tabs[e];
            return (
              <TabPanel height="100%" key={e}>
                <Component />
              </TabPanel>
            );
          })}
        </TabPanels>
      </Tabs>
      <ListSelector />
      <UpdateButton />
    </Box>
  </>
);

ScreenContainer.displayName = "ScreenContainer";
export { ScreenContainer };
