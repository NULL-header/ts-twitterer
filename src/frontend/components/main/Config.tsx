import React, { useCallback } from "react";
import {
  FormControl,
  FormErrorMessage,
  Text,
  Button,
  Box,
  VStack,
  Input,
} from "@chakra-ui/react";
import { useTracked, useUpdate } from "frontend/globalState";
import { useForm } from "react-hook-form";
import { CONSTVALUE } from "frontend/CONSTVALUE";
import { useBool } from "frontend/util";
import { useUpdateEffect } from "react-use";
import { useAsyncTask } from "react-hooks-async";
import { ToggleForm, HeaddingCommon } from "../ConfigBase";

const ItemBar = React.memo(({ listId }: { listId: string }) => {
  const dispatch = useUpdate();
  return (
    <Box display="flex" width="100%">
      <Text marginRight="auto">{listId}</Text>
      <Button
        marginRight="3vw"
        onClick={() => dispatch({ type: "DELETE_LISTIDS", listId })}
      >
        delete
      </Button>
    </Box>
  );
});
ItemBar.displayName = "ItemBar";

const validateListIdsLength = (length: number) =>
  length <= CONSTVALUE.LIST_LIMIT ||
  ((
    <Text>
      listIds is too many. delete list id until it is under
      {` ${CONSTVALUE.LIST_LIMIT}.`}
    </Text>
  ) as any);

const makeValidate = (listIds: string[]) => {
  const { length } = listIds;
  return {
    pattern: {
      value: /^[0-9]+$/,
      message: (<Text>this is woung pattern. use number only.</Text>) as any,
    },
    validate: () => validateListIdsLength(length),
  };
};

const IdForm = () => {
  const [state, dispatch] = useTracked();
  const { listIds } = state;
  const { handleSubmit, errors, register } = useForm<{
    listId: string;
  }>();
  const submitData = useCallback(
    handleSubmit((data) => {
      dispatch({ type: "ADD_LISTIDS", listId: data.listId });
    }),
    [handleSubmit],
  );
  return (
    <Box>
      <HeaddingCommon header="Ids of a list" />
      <form onSubmit={submitData}>
        <Box paddingLeft="5vw">
          <VStack alignItems="start">
            {listIds.map((e) => (
              <ItemBar listId={e} key={e} />
            ))}
          </VStack>
          <FormControl isInvalid={errors.listId != null}>
            <Input
              name="listId"
              marginLeft="-1rem"
              ref={register(makeValidate(listIds))}
              placeholder="write ids you wanna add any lists"
            />
            <FormErrorMessage>
              <Text>{errors.listId?.message}</Text>
            </FormErrorMessage>
          </FormControl>
        </Box>
      </form>
    </Box>
  );
};

const DeleteKeyForm = React.memo(() => {
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

const Config = React.memo(() => (
  <VStack alignItems="right" spacing="10vw">
    <IdForm />
    <ToggleForm />
    <DeleteKeyForm />
  </VStack>
));

Config.displayName = "Config";

export { Config };
