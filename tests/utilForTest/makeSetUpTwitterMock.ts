import { MockedObjectDeep } from "ts-jest/dist/utils/testing";
import { PartialDeep } from "type-fest";
import { mergeDeep } from "timm";
import sampleTweets from "samples/tweet-sample.json";

type Twitter = typeof import("twitter");

const defaultApiValue = {
  "lists/statuses": sampleTweets,
};
type DefaultApiValue = typeof defaultApiValue;
type ApiOptions = {
  [P in keyof DefaultApiValue]: PartialDeep<DefaultApiValue[P]>;
};
export const makeSetUpTwitterMock = (
  TwitterMock: MockedObjectDeep<Twitter>,
) => <T extends keyof ApiOptions>(
  _api?: T,
  overwrite: ApiOptions[T] = {} as ApiOptions[T],
) => {
  // eslint-disable-next-line @typescript-eslint/require-await
  const mockFn = async (path: keyof ApiOptions) => {
    const defaultValue = defaultApiValue[path];
    if (defaultValue == null) throw new Error("unknown path is passed");
    const value = mergeDeep(defaultValue, overwrite);
    return value;
  };
  TwitterMock.prototype.get.mockImplementation(
    mockFn as (path: string) => Promise<any>,
  );
};
