import React from "react";
import { VStack } from "@chakra-ui/react";
import { ToggleForm } from "frontend/components/ConfigBase";
import { DeleteKeyForm } from "./DeleteKeyForm";
import { IdForm } from "./IdForm";
import { LoadTweetsNumForm } from "./LoadTweetsNumForm";

const Config = React.memo(() => (
  <VStack alignItems="right" spacing="10vw">
    <IdForm />
    <ToggleForm />
    <DeleteKeyForm />
    <LoadTweetsNumForm />
  </VStack>
));

Config.displayName = "Config";

export { Config };
