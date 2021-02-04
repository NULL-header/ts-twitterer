import fsOrigin from "fs";
import { CONSTVALUE } from "src/backend/CONSTVALUE";
import Twitter from "twitter";
import { getNewTweetLows } from "src/backend/util";
const fs = fsOrigin.promises;

export const getSample = async (twitterApi: Twitter) => {
  const tweets = await getNewTweetLows(0, twitterApi);
  const tweetsSplitted = [
    tweets.slice(0, 7),
    tweets.slice(7, 14),
    tweets.slice(14),
  ];
  fs.writeFile(
    "tests/sampleTweets/sample.json",
    JSON.stringify(tweetsSplitted),
    {
      encoding: "utf-8",
    }
  ).then(() => console.log("sample updated"));
  return tweets;
};

if (require.main === module) {
  const twitterApi = new Twitter({
    access_token_key: CONSTVALUE.ACCESS_TOKEN,
    access_token_secret: CONSTVALUE.ACCESS_TOKEN_SECRET,
    consumer_key: CONSTVALUE.CONSUMER_TOKEN,
    consumer_secret: CONSTVALUE.CONSUMER_TOKEN_SECRET,
  });
  console.log("run getSample");
  getSample(twitterApi).catch((e) => console.log(e));
}
