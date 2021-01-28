import fsOrigin from "fs";
import { CONSTVALUE } from "src/backend/CONSTVALUE";
import Twitter from "twitter";
const fs = fsOrigin.promises;

export const getSample = async (twitterApi: Twitter) => {
  const tweets = await twitterApi.get("lists/statuses", {
    list_id: CONSTVALUE.SAMPLE_LIST_ID,
  });
  fs.writeFile("tests/sampleTweets/sample.json", JSON.stringify(tweets), {
    encoding: "utf-8",
  });
  return tweets;
};

if (require.main) {
  const twitterApi = new Twitter({
    access_token_key: CONSTVALUE.ACCESS_TOKEN,
    access_token_secret: CONSTVALUE.ACCESS_TOKEN_SECRET,
    consumer_key: CONSTVALUE.CONSUMER_TOKEN,
    consumer_secret: CONSTVALUE.CONSUMER_TOKEN_SECRET,
  });
  getSample(twitterApi);
}
