import React from "react";
import { VStack } from "@chakra-ui/react";
import { ToggleForm } from "frontend/components/ConfigBase";
import { DeleteKeyForm } from "./DeleteKeyForm";

const Config = React.memo(() => (
  <VStack alignItems="right" spacing="10vw">
    <ToggleForm />
    <DeleteKeyForm />
  </VStack>
));

Config.displayName = "Config";

export { Config };
