import { getRateLimitData, makeLimitData } from "./getRateLimit";
import { promises as fs } from "fs";
import { CONSTVALUE } from "src/backend/CONSTVALUE";

const SAMPLE_BASE_PATH =
  CONSTVALUE.SAMPLE_DIRECTORY + CONSTVALUE.SAMPLE_BASE_NAME + "-rate";

export const getSampleRate = async (): Promise<Configs["limitData"]> => {
  const adjustedSampleNullable = await fs
    .readFile(SAMPLE_BASE_PATH + "-adjusted.json", {
      encoding: "utf-8",
    })
    .then(JSON.parse)
    .catch((_err) => undefined);
  if (adjustedSampleNullable != null) return adjustedSampleNullable;
  const sample = await fs
    .readFile(SAMPLE_BASE_PATH + ".json", {
      encoding: "utf-8",
    })
    .catch((_err) => undefined);
  if (sample != null) {
    await fs.writeFile(SAMPLE_BASE_PATH + "-adjusted.json", sample, {
      encoding: "utf-8",
    });
    return makeLimitData(JSON.parse(sample));
  }
  const response = await getRateLimitData();
  const promiseWritingData = fs.writeFile(
    SAMPLE_BASE_PATH + ".json",
    JSON.stringify(response),
    { encoding: "utf-8" }
  );
  const adjustedSample = makeLimitData(response);
  const promiseWritingAdjusted = fs.writeFile(
    SAMPLE_BASE_PATH + "-adjusted.json",
    JSON.stringify(adjustedSample),
    { encoding: "utf-8" }
  );
  await Promise.all([promiseWritingAdjusted, promiseWritingData]);
  return adjustedSample;
};
