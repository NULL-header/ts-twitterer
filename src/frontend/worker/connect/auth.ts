export const authorize = async (
  tokens: Record<
    | "accessToken"
    | "accessTokenSecret"
    | "consumerToken"
    | "consumerTokenSecret",
    string
  >,
) => {
  await fetch("/api/token/set", {
    body: JSON.stringify(tokens),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const unauthorize = async () => {
  await fetch("/api/token/delete", { method: "POST" });
};
