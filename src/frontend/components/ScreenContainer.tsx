import React from "react";
import { Box } from "@chakra-ui/react";
import { ListSelector } from "./ListSelector";
import { UpdateButton } from "./ForDev";
import { TabContainer, TabGroup } from "./TabContainer";

const ScreenContainer = React.memo<{ tabs: TabGroup }>(({ tabs }) => (
  <Box
    role="main"
    height="100vh"
    width="100vw"
    display="flex"
    flexDirection="column"
    padding="2vw"
  >
    <TabContainer tabs={tabs} />
    <ListSelector />
    <UpdateButton />
  </Box>
));

ScreenContainer.displayName = "ScreenContainer";
export { ScreenContainer };
