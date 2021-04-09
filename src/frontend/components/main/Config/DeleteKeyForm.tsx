import React from "react";
import { useBool } from "frontend/util";
import { Box, Button } from "@chakra-ui/react";
import { useUpdateEffect } from "react-use";
import { HeaddingCommon } from "frontend/components/ConfigBase";
import { useDispatch } from "frontend/globalState";

export const DeleteKeyForm = React.memo(() => {
  const [isFired, fire] = useBool(false);
  const dispatch = useDispatch();
  useUpdateEffect(() => {
    if (!isFired) return;
    dispatch({
      type: "DISPATCH_ASYNC",
      updater: (state) =>
        state.updateAsync("authManager", (manager) => manager.unauth()),
    });
  }, [isFired]);
  return (
    <Box>
      <HeaddingCommon header="Delete Keys" />
      <Button onClick={fire}>DELETE</Button>
    </Box>
  );
});
