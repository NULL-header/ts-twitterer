import React, { useCallback } from "react";
import { useBool } from "frontend/util";
import { useAsyncTask } from "react-hooks-async";
import { Box, Button } from "@chakra-ui/react";
import { useUpdateEffect } from "react-use";
import { HeaddingCommon } from "frontend/components/ConfigBase";
import { useSetGlobalDetail } from "frontend/globalState";

export const DeleteKeyForm = React.memo(() => {
  const [isFired, fire] = useBool(false);
  const setGlobalDetail = useSetGlobalDetail();
  const authTask = useAsyncTask(
    useCallback(async ({ signal }) => {
      await fetch("/api/auth/delete", { method: "POST" });
      if (signal.aborted) return;
      setGlobalDetail((state) =>
        state.set("globalData", state.globalData.set("isAuthorized", false)),
      );
    }, []),
  );
  useUpdateEffect(() => {
    if (!isFired) return;
    authTask.start();
  }, [isFired]);
  return (
    <Box>
      <HeaddingCommon header="Delete Keys" />
      <Button onClick={fire}>DELETE</Button>
    </Box>
  );
});
