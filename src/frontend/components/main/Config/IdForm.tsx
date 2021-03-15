// import React, { useCallback } from "react";
// import {
//   Box,
//   Text,
//   Button,
//   VStack,
//   FormControl,
//   FormErrorMessage,
//   Input,
// } from "@chakra-ui/react";
// import { CONSTVALUE } from "frontend/CONSTVALUE";
// import { useForm } from "react-hook-form";
// import { HeaddingCommon } from "frontend/components/ConfigBase";

// const ItemBar = React.memo(({ listId }: { listId: string }) => {
//   const dispatch = useUpdate();
//   return (
//     <Box display="flex" width="100%">
//       <Text marginRight="auto">{listId}</Text>
//       <Button
//         marginRight="3vw"
//         onClick={() => dispatch({ type: "DELETE_LISTIDS", listId })}
//       >
//         delete
//       </Button>
//     </Box>
//   );
// });
// ItemBar.displayName = "ItemBar";

// const validateListIdsLength = (length: number) =>
//   length <= CONSTVALUE.LIST_LIMIT ||
//   ((
//     <Text>
//       listIds is too many. delete list id until it is under
//       {` ${CONSTVALUE.LIST_LIMIT}.`}
//     </Text>
//   ) as any);

// const makeValidate = (listIds: string[]) => {
//   const { length } = listIds;
//   return {
//     pattern: {
//       value: /^[0-9]+$/,
//       message: (<Text>this is woung pattern. use number only.</Text>) as any,
//     },
//     validate: () => validateListIdsLength(length),
//   };
// };

// export const IdForm = () => {
//   const { listIds } = state;
//   const { handleSubmit, errors, register } = useForm<{
//     listId: string;
//   }>();
//   const submitData = useCallback(
//     handleSubmit((data) => {
//       dispatch({ type: "ADD_LISTIDS", listId: data.listId });
//     }),
//     [handleSubmit],
//   );
//   return (
//     <Box>
//       <HeaddingCommon header="Ids of a list" />
//       <form onSubmit={submitData}>
//         <Box paddingLeft="5vw">
//           <VStack alignItems="start">
//             {listIds.map((e) => (
//               <ItemBar listId={e} key={e} />
//             ))}
//           </VStack>
//           <FormControl isInvalid={errors.listId != null}>
//             <Input
//               name="listId"
//               marginLeft="-1rem"
//               ref={register(makeValidate(listIds))}
//               placeholder="write ids you wanna add any lists"
//             />
//             <FormErrorMessage>
//               <Text>{errors.listId?.message}</Text>
//             </FormErrorMessage>
//           </FormControl>
//         </Box>
//       </form>
//     </Box>
//   );
// };
