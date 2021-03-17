import { app } from "backend/app";
import nodeFetch, { RequestInit, Response } from "node-fetch";
import { fetch as CookieFetch, CookieJar } from "node-fetch-cookies";
import { FetchError } from "./error";

const getJson = async (res: Response) => {
  const json = await res.json();
  if (!res.ok) throw new FetchError(res, json);
  return json;
};

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
    return getJson(response);
  };
  return {
    fetch,
    server,
  };
};

export const makeFetchWithCookie = () => {
  const jar = new CookieJar();
  return async (additionalPath: string, init?: RequestInit) => {
    const response = await CookieFetch(jar, additionalPath, init);
    return getJson(response);
  };
};
