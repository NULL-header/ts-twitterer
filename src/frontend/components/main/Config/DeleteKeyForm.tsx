import React, { useCallback } from "react";
import { useBool } from "frontend/util";
import { useUpdate } from "frontend/globalState";
import { useAsyncTask } from "react-hooks-async";
import { Box, Button } from "@chakra-ui/react";
import { useUpdateEffect } from "react-use";
import { HeaddingCommon } from "frontend/components/ConfigBase";

export const DeleteKeyForm = React.memo(() => {
  const [isFired, fire] = useBool(false);
  const dispatch = useUpdate();
  const task = useAsyncTask(
    useCallback(
      async ({ signal }) => {
        const result = await fetch("/api/auth/delete", { method: "POST" });
        console.log(result);
        if (signal.aborted) return;
        dispatch({ type: "AUTHORISE" });
      },
      [isFired],
    ),
  );
  useUpdateEffect(() => {
    if (!isFired) return;
    task.start();
  }, [isFired]);
  return (
    <Box>
      <HeaddingCommon header="Delete Keys" />
      <Button onClick={fire}>DELETE</Button>
    </Box>
  );
});
