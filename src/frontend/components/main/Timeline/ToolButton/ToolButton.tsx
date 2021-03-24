import React, { memo, ReactNode, useCallback } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Circle,
  useColorMode,
} from "@chakra-ui/react";
import { HiMenu } from "react-icons/hi";
import { ToolDetail } from "./ToolDetail";

const CircleWithColorMode = memo<{ children: ReactNode }>(({ children }) => {
  const { colorMode } = useColorMode();
  const commonSetting = {
    size: 10,
    // position: "absolute" as any,
    // right: "10",
    // bottom: "10",
  };
  if (colorMode === "dark")
    return (
      <Circle {...commonSetting} bgColor="grey">
        {children}
      </Circle>
    );
  return (
    <Circle
      {...commonSetting}
      borderColor="black"
      borderWidth={3}
      borderStyle="solid"
    >
      {children}
    </Circle>
  );
});
CircleWithColorMode.displayName = "CircleWithColorMode";

export const ToolButton = memo<{
  setDetail: (f: (detail: ToolDetail) => ToolDetail) => void;
}>(({ setDetail }) => {
  const openListTool = useCallback(
    () => setDetail((detail) => detail.set("listTool", true)),
    [setDetail],
  );

  return (
    <Menu isLazy>
      <MenuButton position="absolute" right="10" bottom="10">
        <CircleWithColorMode>
          <Icon as={HiMenu} />
        </CircleWithColorMode>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={openListTool}>List ids</MenuItem>
      </MenuList>
    </Menu>
  );
});

ToolButton.displayName = "ToolButton";
