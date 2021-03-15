import React from "react";
import { VStack } from "@chakra-ui/react";
import { ToggleForm } from "../ConfigBase";

export const Config = React.memo(() => (
  <VStack alignItems="right" spacing="10vw">
    <ToggleForm />
  </VStack>
));
