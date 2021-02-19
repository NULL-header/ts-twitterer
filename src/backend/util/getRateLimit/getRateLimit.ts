import { twitterApi } from "backend/twitterApi";

export const getRateLimitData = async () =>
  await twitterApi.get("application/rate_limit_status", {
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
