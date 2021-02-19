import { promises as fsOrigin } from "fs";
import { getRateLimitData, makeLimitData } from "./getRateLimit";
import { getNewTweetData, makeTweetLows } from "./getTweet";
import { CONSTVALUE } from "../CONSTVALUE";

const makeFs = (basePath: string) => ({
  read: async (additionalPath: string) =>
    await fsOrigin
      .readFile(basePath + additionalPath, { encoding: "utf-8" })
      .then(JSON.parse)
      .catch(() => undefined),
  write: async (additionalPath: string, target: string) =>
    await fsOrigin
      .writeFile(basePath + additionalPath, target, {
        encoding: "utf-8",
      })
      .catch(() => undefined),
});

type Fs = ReturnType<typeof makeFs>;

const makeUtil = (fs: Fs) => (suffix: string): Fs => {
  const underPath = `-${suffix}.json`;
  return {
    read: async (path: string) => fs.read(path + underPath),
    write: async (path: string, target: string) =>
      fs.write(path + underPath, target),
  };
};

const makeSampleGetter = <
  GetterArgs extends Array<any>,
  MakerArgs extends Array<any>,
  Result
>(
  getter: (...args: GetterArgs) => Promise<any>,
  maker: (arg: any, ...args: MakerArgs) => Result,
  basePath: string,
) => {
  const fs = makeFs(basePath);
  const utils = makeUtil(fs);
  const adjustedUtil = utils("adjusted");
  const rawUtil = utils("raw");
  return async (
    args: { getter: GetterArgs; maker: MakerArgs },
    doesUpdate: boolean,
    additionalPath?: string,
  ): Promise<Result> => {
    const path = additionalPath == null ? "" : `-${additionalPath}`;

    const adjustedSample = await adjustedUtil.read(path);
    if (adjustedSample != null && !doesUpdate) return adjustedSample as Result;

    const rawSample = await rawUtil.read(path);
    if (rawSample != null && !doesUpdate) {
      const localAdjustedSample = maker(rawSample, ...args.maker);
      await adjustedUtil.write(path, JSON.stringify(localAdjustedSample));
      return localAdjustedSample;
    }

    const remoteRawSample = await getter(...args.getter);
    const promiseRaw = rawUtil.write(path, JSON.stringify(remoteRawSample));
    const remoteAdjustedSample = maker(remoteRawSample, ...args.maker);
    const promiseAdjusted = adjustedUtil.write(
      path,
      JSON.stringify(remoteAdjustedSample),
    );
    await Promise.all([promiseRaw, promiseAdjusted]);
    return remoteAdjustedSample;
  };
};

const SAMPLE_BASE_PATH =
  CONSTVALUE.SAMPLE_DIRECTORY + CONSTVALUE.SAMPLE_BASE_NAME;

const RATE_PATH = `${SAMPLE_BASE_PATH}-rate`;

export const getSampleRate = makeSampleGetter(
  getRateLimitData,
  makeLimitData,
  RATE_PATH,
);

const TWEET_PATH = `${SAMPLE_BASE_PATH}-tweet`;

export const getSampleTweet = makeSampleGetter(
  getNewTweetData,
  makeTweetLows,
  TWEET_PATH,
);
