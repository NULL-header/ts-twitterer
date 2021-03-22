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
    position: "absolute" as any,
    right: "10",
    bottom: "10",
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
    <CircleWithColorMode>
      <Menu isLazy>
        <MenuButton>
          <Icon as={HiMenu} />
        </MenuButton>
        <MenuList transformOrigin="right bottom !important">
          <MenuItem onClick={openListTool}>List ids</MenuItem>
        </MenuList>
      </Menu>
    </CircleWithColorMode>
  );
});

ToolButton.displayName = "ToolButton";
