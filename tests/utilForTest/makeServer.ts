import { app } from "backend/app";
import nodeFetch, { RequestInit } from "node-fetch";

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await response.json();
  };
  return {
    fetch,
    server,
  };
};
