/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { twitterApi } from "backend/twitterApi";

export const getRateLimitData = () =>
  twitterApi.get("application/rate_limit_status", {
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

export const getRateLimit = async (): Promise<LimitData> => {
  const response = await getRateLimitData();
  return makeLimitData(response);
};
