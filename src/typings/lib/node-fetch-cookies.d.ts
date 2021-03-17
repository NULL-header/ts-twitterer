declare module "node-fetch-cookies" {
  type NodeFetch = typeof import("node-fetch").default;
  export class CookieJar {}
  type FetchCookies = (
    cookieJar: CookieJar,
    ...args: NodeFetch extends (...nodeFetchArgs: infer A) => any ? A : never
  ) => ReturnType<NodeFetch>;
  export const fetch: FetchCookies;
}
