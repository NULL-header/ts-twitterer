import React from "react";
import { Divider, Heading, Button, Box, useColorMode } from "@chakra-ui/react";

export const HeaddingCommon = React.memo(({ header }: { header: string }) => (
  <Box display="table">
    <Heading size="md">{header}</Heading>
    <Divider marginBottom="2vw" width="calc(100% + 5vw)" />
  </Box>
));
HeaddingCommon.displayName = "HeaddingCommon";

export const ToggleForm = () => {
  const { toggleColorMode } = useColorMode();
  return (
    <Box>
      <HeaddingCommon header="toggle Theme" />
      <Button marginLeft="5vw" onClick={toggleColorMode}>
        HERE
      </Button>
    </Box>
  );
};
