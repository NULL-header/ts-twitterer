import { fetch as cookieFetch, CookieJar } from "node-fetch-cookies";

type NodeFetch = typeof import("node-fetch").default;

let jar: CookieJar;

const fetch = (
  ...args: NodeFetch extends (...nodeFetchArgs: infer A) => any ? A : never
) => cookieFetch(jar, `http://localhost:3000${args[0]}`, args[1]);

(global as typeof global & { fetch: any }).fetch = fetch;

beforeEach(() => {
  jar = new CookieJar();
});
