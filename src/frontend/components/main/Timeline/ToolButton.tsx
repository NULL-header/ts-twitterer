import React, { memo, ReactNode } from "react";
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

export const ToolButton = memo(() => (
  <CircleWithColorMode>
    <Menu isLazy>
      <MenuButton>
        <Icon as={HiMenu} />
      </MenuButton>
      <MenuList transformOrigin="right bottom !important">
        <MenuItem>List ids</MenuItem>
      </MenuList>
    </Menu>
  </CircleWithColorMode>
));

ToolButton.displayName = "ToolButton";
