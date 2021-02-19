/* eslint-disable @typescript-eslint/naming-convention */

import express from "express";
import { getNewTweetLows, getRateLimit } from "./util";

export const router = express
  .Router()
  .use(express.static("public"))
  .get("/api/ping", (req, res) => {
    res.send({ response: "pong!" });
  })
  .get("/api/tweet", async (req, res) => {
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
      list_id,
    ).catch((err) => console.log(err));
    res.send(tweetLows);
  })
  .get("/api/rate", async (req, res) => {
    const response = await getRateLimit().catch((err) => console.log(err));
    res.send(response);
  });
