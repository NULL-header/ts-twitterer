/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/naming-convention */

import express from "express";
import Twitter from "twitter";
import { getNewTweetLows, getRateLimit } from "./util";
import { Tokens } from "./types";

export const router = express
  .Router()
  .use(express.static("public"))
  .get("/api/ping", (req, res) => {
    res.send({ response: "pong!" });
  })
  .get("/api/tweet", async (req, res) => {
    const {
      last_newest_tweet_data_id,
      list_id_str: listId,
    } = req.query as Record<string, string>;
    const {
      accessToken,
      accessTokenSecret,
      consumerToken,
      consumerTokenSecret,
    } = req.session as typeof req.session & Tokens;
    if (
      accessToken == null ||
      accessTokenSecret == null ||
      consumerToken == null ||
      consumerTokenSecret == null
    ) {
      res.status(400).send({ message: "authorize before getting tweet" });
      return;
    }
    if (last_newest_tweet_data_id == null) {
      res
        .status(400)
        .send({ message: "pass last_newest_tweet_data_id as number" });
      return;
    }
    if (listId == null) {
      res.status(400).send({ message: "pass list_id of number" });
      return;
    }
    const tweetLows = await getNewTweetLows(
      last_newest_tweet_data_id,
      listId,
      new Twitter({
        consumer_key: consumerToken,
        consumer_secret: consumerTokenSecret,
        access_token_key: accessToken,
        access_token_secret: accessTokenSecret,
      }),
    ).catch((err) => console.log(err));
    res.send(tweetLows);
  })
  .get("/api/rate", async (req, res) => {
    const {
      accessToken,
      accessTokenSecret,
      consumerToken,
      consumerTokenSecret,
    } = req.session as typeof req.session & Tokens;
    if (
      accessToken == null ||
      accessTokenSecret == null ||
      consumerToken == null ||
      consumerTokenSecret == null
    ) {
      res.status(400).send({ message: "authorize before getting rate" });
      return;
    }
    const response = await getRateLimit(
      new Twitter({
        consumer_key: consumerToken,
        consumer_secret: consumerTokenSecret,
        access_token_key: accessToken,
        access_token_secret: accessTokenSecret,
      }),
    ).catch((err) => console.log(err));
    res.send(response);
  })
  .post("/api/token/set", (req, res) => {
    const {
      consumer_token: consumerToken,
      consumer_token_secret: consumerTokenSecret,
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
    } = req.body;
    Object.assign(req.session, {
      consumerToken,
      consumerTokenSecret,
      accessToken,
      accessTokenSecret,
    });
    res.end();
  })
  .post("/api/token/delete", (req, res) => {
    Object.assign(req.session, {
      consumerToken: undefined,
      consumerTokenSecret: undefined,
      accessToken: undefined,
      accessTokenSecret: undefined,
    });
    res.end();
  });
