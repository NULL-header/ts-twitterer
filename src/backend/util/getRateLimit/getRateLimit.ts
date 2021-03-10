/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Twitter from "twitter";

export const getRateLimitData = (client: Twitter) =>
  client.get("application/rate_limit_status", {
    resources: "lists",
  });

export const makeLimitData = (response: any): LimitData => {
  const {
    resources: { lists },
  } = response;
  const listsLimit = lists["/lists/statuses"];
  const { limit, remaining } = listsLimit;
  return { lists: { limitRate: limit, remaining } };
};

export const getRateLimit = async (client: Twitter): Promise<LimitData> => {
  const response = await getRateLimitData(client);
  return makeLimitData(response);
};
