type NodeFetch = typeof import("node-fetch").default;

type FetchCookies<T> = (
  cookieJar: T,
  ...args: NodeFetch extends (...nodeFetchArgs: infer A) => any ? A : never
) => ReturnType<NodeFetch>;

declare module "node-fetch-cookies" {
  export class CookieJar {}
  export const fetch: FetchCookies<CookieJar>;
}
