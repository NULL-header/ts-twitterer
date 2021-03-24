import React, { memo, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  FormControl,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";
import { useForm, RegisterOptions } from "react-hook-form";
import { CONSTVALUE } from "frontend/CONSTVALUE";
import { useTimelineDetail } from "../context";
import { Modal } from "./Modal";

const ListidItem = memo<{
  listid: string;
  deleteListid: (listid: string) => void;
}>(({ deleteListid, listid }) => (
  <Box display="flex">
    <Text>{listid}</Text>
    <Button onClick={() => deleteListid(listid)}>DELETE</Button>
  </Box>
));
ListidItem.displayName = "ListidItem";

const validateListIdsLength = (length: number) => () =>
  length <= CONSTVALUE.LIST_LIMIT ||
  `
      Listids is too many. delete list id until it is under
       ${CONSTVALUE.LIST_LIMIT}
    `;

type Listids = ReturnType<
  typeof useTimelineDetail
>["timelineDetail"]["listids"];

const validateDuplicateListid = (listids: Listids) => ({
  listid,
}: {
  listid: string;
}) => !listids.includes(listid) || "The listid is duplicated.";

const useValidate = (listids: Listids) =>
  useMemo(
    () =>
      ({
        pattern: {
          value: /^[0-9]+$/,
          message: "This is wrong pattern. use number only.",
        },
        validate: {
          listidsLength: validateListIdsLength(listids.size),
          duplicate: validateDuplicateListid(listids),
        },
        required: "This is required. Do not submit without putting the id.",
      } as RegisterOptions),
    [listids],
  );

export const ListForm = memo<{ isOpen: boolean; onClose: () => void }>(
  ({ isOpen, onClose }) => {
    const { setTimelineDetail, timelineDetail } = useTimelineDetail();
    const { handleSubmit, errors, register } = useForm<{ listid: string }>();
    const listids = useMemo(() => timelineDetail.listids, [
      timelineDetail.listids,
    ]);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const submitData = useCallback(
      handleSubmit((data) => {
        setTimelineDetail((detail) =>
          detail.set("listids", detail.listids.push(data.listid)),
        );
        if (inputRef.current == null) return;
        inputRef.current.value = "";
      }),
      [],
    );
    const deleteListid = useCallback(
      (listid: string) =>
        setTimelineDetail((detail) => detail.removeListid(listid)),
      [],
    );
    const validateOptions = useValidate(listids);
    return (
      <Modal isOpen={isOpen} onClose={onClose} header="Ids of a list">
        <VStack>
          {listids.map((e) => (
            <ListidItem deleteListid={deleteListid} listid={e} key={e} />
          ))}
          <form onSubmit={submitData}>
            <FormControl isInvalid={errors.listid != null}>
              <Input
                name="listid"
                ref={useCallback((e) => {
                  register(e, validateOptions);
                  inputRef.current = e;
                }, [])}
                placeholder="Put ids you wanna add any lists"
              />
              <FormErrorMessage>
                <Text>{errors.listid?.message}</Text>
              </FormErrorMessage>
            </FormControl>
          </form>
        </VStack>
      </Modal>
    );
  },
);

ListForm.displayName = "ListForm";
