import React, { useCallback } from "react";
import {
  FormControl,
  FormErrorMessage,
  Divider,
  Heading,
  Text,
  Button,
  Box,
  VStack,
  Input,
  useColorMode,
} from "@chakra-ui/react";
import { useTracked } from "frontend/globalState";
import { useForm } from "react-hook-form";
import { ContentContainer } from "../ContentContainer";
import { CONSTVALUE } from "../../CONSTVALUE";

const HeaddingCommon = React.memo(({ header }: { header: string }) => (
  <Box display="table">
    <Heading size="md">{header}</Heading>
    <Divider marginBottom="2vw" width="calc(100% + 5vw)" />
  </Box>
));
HeaddingCommon.displayName = "HeaddingCommon";

const ItemBar = React.memo(({ listId }: { listId: string }) => (
  <Text>{listId}</Text>
));
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
      dispatch({ type: "UPDATE_LISTIDS", dispatch, listId: data.listId });
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

const ToggleForm = () => {
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

const Config = React.memo(() => (
  <ContentContainer header="Config">
    <VStack alignItems="right" spacing="10vw">
      <IdForm />
      <ToggleForm />
    </VStack>
  </ContentContainer>
));

Config.displayName = "Config";

export { Config };
