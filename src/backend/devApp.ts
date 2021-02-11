/* eslint-disable camelcase */
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import getConfigDev from "webpack.config.dev";
import { app } from "./app";
import { getSampleTweet, getSampleRate } from "src/backend/util";

const config = getConfigDev({ production: false, development: true });
const compiler = webpack(config);

const getLoopThree = (() => {
  let i = 0;
  return () => {
    if (i === 3) i = 0;
    return i++;
  };
})();

const getBoolean = (arg: string | undefined) =>
  arg == null ? false : Boolean(arg);

export const devApp = app
  .use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output?.publicPath,
      stats: "errors-only",
    })
  )
  .use(webpackHotMiddleware(compiler))
  .get("/api/sample", async (req, res) => {
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
        getter: [listId],
        maker: [listId, lastNewestTweetDataId],
      },
      doesUpdate,
      listId.toString()
    );
    const resultSplitted = [
      result.slice(0, 7),
      result.slice(7, 14),
      result.slice(14),
    ];
    res.send(resultSplitted[getLoopThree()]);
  })
  .get("sample/rate", async (req, res) => {
    const { forced_update: forcedUpdate } = req.query as Record<string, string>;
    const doesUpdate = getBoolean(forcedUpdate);
    const result = await getSampleRate({ getter: [], maker: [] }, doesUpdate);
    res.send(result);
  });
