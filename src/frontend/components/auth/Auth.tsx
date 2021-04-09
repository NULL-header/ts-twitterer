import React, { useCallback } from "react";
import {
  FormControl,
  FormLabel,
  Text,
  FormErrorMessage,
  VStack,
  Input,
  Button,
  Box,
} from "@chakra-ui/react";
import { useForm, FieldError } from "react-hook-form";
import { useDispatch } from "frontend/globalState";
import { HeaddingCommon } from "../ConfigBase";

const names = {
  "ACCESS TOKEN": "accessToken",
  "ACCESS TOKEN SECRET": "accessTokenSecret",
  "CONSUMER TOKEN": "consumerToken",
  "CONSUMER TOKEN SECRET": "consumerTokenSecret",
} as const;

type Names = typeof names;
type TokenNames = keyof Names;

const Item = React.memo(
  React.forwardRef<
    HTMLInputElement | null,
    { name: string; error: FieldError | undefined }
  >(({ name, error }, ref) => (
    <FormControl isInvalid={error != null}>
      <FormLabel>
        <Text>{name}</Text>
      </FormLabel>
      <Input ref={ref} placeholder={`enter ${name}`} name={name} />
      <FormErrorMessage>
        <Text>{error?.message}</Text>
      </FormErrorMessage>
    </FormControl>
  )),
);

type Fields = { [P in keyof typeof names]: string };

// [keyof typeof names

const AuthForm = () => {
  const dispatch = useDispatch();
  const { errors, register, handleSubmit } = useForm<Fields>();
  const submit = useCallback(
    handleSubmit((data) => {
      const dataTransformed = {} as Record<Names[TokenNames], string>;
      (Object.entries(data) as [TokenNames, string][]).forEach(
        ([key, value]) => {
          dataTransformed[names[key]] = value;
        },
      );
      dispatch({
        type: "DISPATCH_ASYNC",
        updater: (state) =>
          state.updateAsync("authManager", (manager) =>
            manager.auth(dataTransformed),
          ),
      });
    }),
    [handleSubmit],
  );

  return (
    <Box aria-label="tokens">
      <HeaddingCommon header="Tokens" />
      <form onSubmit={submit}>
        <VStack spacing="5vw">
          {(Object.keys(names) as TokenNames[]).map((e) => (
            <Item
              key={e}
              name={e}
              error={errors[e]}
              ref={register({
                required: "It is empty. Please put token.",
              })}
            />
          ))}
          <Button type="submit">submit</Button>
        </VStack>
      </form>
    </Box>
  );
};

export const Auth = () => <AuthForm />;
