/* eslint-disable @typescript-eslint/no-misused-promises */
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "webpack.config.dev";
import { getSampleTweet, getSampleRate } from "backend/util";
import Twitter from "twitter";
import { app } from "./app";
import { Tokens } from "./types";

const compiler = webpack(config);

const getLoopThree = (() => {
  let i = 0;
  return () => {
    if (i === 2) i = -1;
    i += 1;
    return i;
  };
})();

const getBoolean = (arg: string | undefined) =>
  arg == null ? false : Boolean(arg);

export const devApp = app
  .use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output?.publicPath as string,
      stats: "errors-only",
    }),
  )
  .use(webpackHotMiddleware(compiler))
  .get("/sample/tweet", async (req, res) => {
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
    const {
      list_id_str: listId,
      forced_update: forcedUpdate,
      last_newest_tweet_data_id: lastNewestTweetDataId,
    } = req.query as Record<string, string>;
    const doesUpdate = getBoolean(forcedUpdate);
    console.log(req.query);
    if (lastNewestTweetDataId == null) {
      res
        .status(400)
        .send({ message: "pass last_newest_tweet_data_id as number" });
      return;
    }
    if (listId == null) {
      res.status(400).send({ message: "pass list_id of number" });
      return;
    }
    const result = await getSampleTweet(
      {
        getter: [
          listId,
          new Twitter({
            consumer_key: consumerToken,
            consumer_secret: consumerTokenSecret,
            access_token_key: accessToken,
            access_token_secret: accessTokenSecret,
          }),
        ],
        maker: [listId, lastNewestTweetDataId],
      },
      doesUpdate,
      listId.toString(),
    );
    const resultSplitted = [
      result.slice(0, 7),
      result.slice(7, 14),
      result.slice(14),
    ];
    res.send(resultSplitted[getLoopThree()]);
  })
  .get("/sample/rate", async (req, res) => {
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
    const { forced_update: forcedUpdate } = req.query as Record<string, string>;
    const doesUpdate = getBoolean(forcedUpdate);
    const result = await getSampleRate(
      {
        getter: [
          new Twitter({
            consumer_key: consumerToken,
            consumer_secret: consumerTokenSecret,
            access_token_key: accessToken,
            access_token_secret: accessTokenSecret,
          }),
        ],
        maker: [],
      },
      doesUpdate,
    );
    res.send(result);
  });
