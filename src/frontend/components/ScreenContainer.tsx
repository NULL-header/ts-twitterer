import React from "react";
import { Tabs, Tab, TabList, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import { Data } from "./Data";
import { Timeline } from "./TimeLine";
import { Config } from "./Config";
import { ListSelector } from "./ListSelector";
import { UpdateButton } from "./ForDev";

const tabs = ["Timeline", "Config", "Data"];
const tabPanels = [Timeline, Config, Data];

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
          {tabs.map((e) => (
            <Tab
              borderRightWidth="2px"
              borderLeftWidth="0px"
              marginRight="-2px"
              marginLeft="0px"
              padding="1vw 1.5vw"
              key={e}
            >
              {e}
            </Tab>
          ))}
        </TabList>
        <TabPanels height="100%">
          {tabPanels.map((E) => (
            <TabPanel height="100%" key={E.name || (E as any).displayName}>
              <E />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      <ListSelector />
      <UpdateButton />
    </Box>
  </>
);

ScreenContainer.displayName = "ScreenContainer";
export { ScreenContainer };
