import { app } from "backend/app";
import nodeFetch, { RequestInit } from "node-fetch";
import { FetchError } from "./error";

export const makeServer = ({ port }: { port: number }) => {
  const serverPromise = new Promise<ReturnType<typeof app.listen>>(
    (resolve) => {
      const httpServer = app.listen(port, () => resolve(httpServer));
    },
  );
  const server = {
    run: () => serverPromise,
    close: async (): Promise<void> => {
      const httpServer = await serverPromise;
      return new Promise((resolve) => httpServer.close(resolve as any));
    },
  };
  const fetch = async (additionalPath: string, init?: RequestInit) => {
    const response = await nodeFetch(
      `http://localhost:${port}${additionalPath}`,
      init,
    );
    const json = await response.json();
    if (!response.ok) throw new FetchError(response, json);
    return json;
  };
  return {
    fetch,
    server,
  };
};
