import express from "express";
import fsOrigin from "fs";
import { CONSTVALUE } from "./CONSTVALUE";
import Twitter from "twitter";
import { getSample } from "tests/sampleTweets/getSample";

const fs = fsOrigin.promises;

const twitterApi = new Twitter({
  access_token_key: CONSTVALUE.ACCESS_TOKEN,
  access_token_secret: CONSTVALUE.ACCESS_TOKEN_SECRET,
  consumer_key: CONSTVALUE.CONSUMER_TOKEN,
  consumer_secret: CONSTVALUE.CONSUMER_TOKEN_SECRET,
});

export const app = express()
  .use(express.static("public"))
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
  })
  .get("/api/sample", (req, res) => {
    fs.readFile("tests/sampleTweets/sample.json", {
      encoding: "utf-8",
    })
      .then((content) => {
        res.send(JSON.parse(content));
      })
      .catch((_err) => {
        const content = getSample(twitterApi);
        res.send(content);
      });
  });
