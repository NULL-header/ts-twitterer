import express from "express";
import { CONSTVALUE } from "./CONSTVALUE";
import Twitter from "twitter";

const app = express();
const twitterApi = new Twitter({
  access_token_key: CONSTVALUE.ACCESS_TOKEN,
  access_token_secret: CONSTVALUE.ACCESS_TOKEN_SECRET,
  consumer_key: CONSTVALUE.CONSUMER_TOKEN,
  consumer_secret: CONSTVALUE.CONSUMER_TOKEN_SECRET,
});
app.use(express.static("public"));

app
  .get("/api/ping", (req, res) => {
    res.send({ response: "pong!" });
  })
  .get("/api/tweets", (req, res) => {
    console.log(CONSTVALUE);
    twitterApi
      .get("lists/statuses", { list_id: CONSTVALUE.SAMPLE_LIST_ID })
      .then((result) => {
        console.log(JSON.stringify(result));
        res.send(result);
      })
      .catch((err) => console.log(err));
  });

app.listen(3000);
