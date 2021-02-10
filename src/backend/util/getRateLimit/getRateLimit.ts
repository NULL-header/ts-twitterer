import { twitterApi } from "src/backend/twitterApi";

export const getRateLimit = async (): Promise<LimitData> => {
  const response = await twitterApi.get("application/rate_limit_status", {
    resources: "lists",
  });
  return makeLimitData(response);
};

const makeLimitData = (response: any): LimitData => {
  const {
    resources: { lists },
  } = response;
  const listsLimit = lists["/lists/statuses"];
  const { limit, remaining } = listsLimit;
  return { lists: { limitRate: limit, remaining } };
};
