import fsOrigin from "fs";
import { getNewTweetLows } from ".";
const fs = fsOrigin.promises;

export const getSample = async (listId: string, fileBasePath: string) => {
  const tweets = await getNewTweetLows("", listId);
  const tweetsSplitted = [
    tweets.slice(0, 7),
    tweets.slice(7, 14),
    tweets.slice(14),
  ];
  // fix up for any samples
  fs.writeFile(
    fileBasePath + `${listId}.json`,
    JSON.stringify(tweetsSplitted),
    {
      encoding: "utf-8",
    }
  ).then(() => console.log("sample updated"));
  return tweetsSplitted;
};
