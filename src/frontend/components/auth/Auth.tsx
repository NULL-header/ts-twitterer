import React, { useRef, useCallback } from "react";
import {
  FormControl,
  FormLabel,
  Text,
  FormErrorMessage,
  VStack,
  Input,
  Button,
} from "@chakra-ui/react";
import { useForm, FieldError } from "react-hook-form";
import { useAsyncTask } from "react-hooks-async";
import { useSetGlobalState } from "frontend/globalState";
import { HeaddingCommon } from "../ConfigBase";

const tokens = [
  "CONSUMER_TOKEN",
  "CONSUMER_TOKEN_SECRET",
  "ACCESS_TOKEN",
  "ACCESS_TOKEN_SECRET",
] as const;

const names = {
  ACCESS_TOKEN: "access_token",
  ACCESS_TOKEN_SECRET: "access_token_secret",
  CONSUMER_TOKEN: "consumer_token",
  CONSUMER_TOKEN_SECRET: "consumer_token_secret",
} as Record<typeof tokens[number], string>;

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

type Fields = { [P in typeof tokens[number]]: string };

const AuthForm = () => {
  const dataRef = useRef<Record<string, string>>({});
  const setGlobalState = useSetGlobalState();
  const authTask = useAsyncTask(
    useCallback(async ({ signal }) => {
      await fetch("/api/token/set", {
        body: JSON.stringify(dataRef.current),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (signal.aborted) return;
      setGlobalState((state) => state.set("isAuthorized", true));
    }, []),
  );
  const { errors, register, handleSubmit } = useForm<Fields>();
  const submit = useCallback(
    handleSubmit((data) => {
      Object.entries(data).forEach(([key, value]) => {
        dataRef.current[names[key as keyof Fields]] = value;
      });
      authTask.start();
    }),
    [handleSubmit],
  );
  return (
    <>
      <HeaddingCommon header="Tokens" />
      <form onSubmit={submit}>
        <VStack spacing="5vw">
          {tokens.map((e) => (
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
    </>
  );
};

export const Auth = () => <AuthForm />;
