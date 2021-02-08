/* eslint-disable camelcase */
import express from "express";
import { getNewTweetLows } from "./util";

export const router = express
  .Router()
  .use(express.static("public"))
  .get("/api/ping", (req, res) => {
    res.send({ response: "pong!" });
  })
  .get("/api/tweets", async (req, res) => {
    const { last_newest_tweet_data_id, list_id } = req.query as Record<
      string,
      string
    >;
    if (last_newest_tweet_data_id == null) {
      res
        .status(400)
        .send({ message: "pass last_newest_tweet_data_id as number" });
    }
    if (list_id == null) {
      res.status(400).send({ message: "pass list_id of number" });
      return;
    }
    const tweetLows = await getNewTweetLows(
      last_newest_tweet_data_id,
      list_id
    ).catch((err) => console.log(err));
    res.send(tweetLows);
  });
