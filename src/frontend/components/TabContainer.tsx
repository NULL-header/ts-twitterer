import React, { memo, FC, useLayoutEffect } from "react";
import {
  Tabs,
  TabPanel,
  TabPanels,
  TabList,
  Tab,
  Icon,
  Text,
  Collapse,
} from "@chakra-ui/react";
import { delayCall, useBool } from "frontend/util";
import { ContentContainer } from "./ContentContainer";

export type TabGroup = Record<string, { Component: FC; Icon: FC }>;

interface Props {
  tabs: TabGroup;
}

const useWindowWidthEffect = (effect: () => void) => {
  useLayoutEffect(() => {
    const handler = delayCall(() => {
      effect();
    });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  });
};

const AllTab = memo<Props>(({ tabs }) => {
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
});
AllTab.displayName = "AllTab";

export const TabContainer = memo<Props>(({ tabs }) => (
  <Tabs
    orientation="vertical"
    flexGrow={1}
    display="flex"
    // this line is needed because the scroll system is broken if
    // it is removed.
    overflow="hidden"
  >
    <TabList marginBottom="auto" borderRightWidth="2px" borderLeftWidth="0px">
      <AllTab tabs={tabs} />
    </TabList>
    <TabPanels height="100%">
      {Object.keys(tabs).map((e) => {
        const { Component } = tabs[e];
        return (
          <TabPanel height="100%" key={e}>
            <ContentContainer header={e}>
              <Component />
            </ContentContainer>
          </TabPanel>
        );
      })}
    </TabPanels>
  </Tabs>
));
TabContainer.displayName = "TabContainer";
