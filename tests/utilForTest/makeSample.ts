import Twitter from "twitter";
import { CONSTVALUE } from "backend/CONSTVALUE";
import { promises as fs } from "fs";

const twitterClient = new Twitter({
  access_token_key: CONSTVALUE.ACCESS_TOKEN,
  access_token_secret: CONSTVALUE.ACCESS_TOKEN_SECRET,
  consumer_key: CONSTVALUE.CONSUMER_TOKEN,
  consumer_secret: CONSTVALUE.CONSUMER_TOKEN_SECRET,
});

const makeTweetsSample = async () => {
  const response = await twitterClient.get("lists/statuses", {
    list_id: CONSTVALUE.SAMPLE_LIST_ID,
    include_rts: true,
    tweet_mode: "extended",
  });
  await fs.writeFile("samples/tweet-sample.json", JSON.stringify(response), {
    encoding: "utf-8",
  });
};

(async () => {
  await makeTweetsSample();
  console.log("sample maked");
})();
