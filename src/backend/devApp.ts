/* eslint-disable camelcase */
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import getConfigDev from "webpack.config.dev";
import { app } from "./app";
import { promises as fs } from "fs";
import { CONSTVALUE } from "./CONSTVALUE";
import { getSample } from "src/tests/sampleTweets/getSample";

const config = getConfigDev({ production: false, development: true });
const compiler = webpack(config);

const SAMPLE_BASE_PATH =
  CONSTVALUE.SAMPLE_DIRECTORY + CONSTVALUE.SAMPLE_BASE_NAME;

const getLoopThree = (() => {
  let i = 0;
  return () => {
    if (i === 3) i = 0;
    return i++;
  };
})();

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
      list_id_str,
      forced_update,
      last_newest_tweet_data_id,
    } = req.query as Record<string, string>;
    console.log(req.query);
    if (last_newest_tweet_data_id == null) {
      res
        .status(400)
        .send({ message: "pass last_newest_tweet_data_id as number" });
    }
    if (list_id_str == null) {
      res.status(400).send({ message: "pass list_id of number" });
      return;
    }
    const sample = forced_update
      ? await getSample(list_id_str, SAMPLE_BASE_PATH)
      : await fs
          .readFile(SAMPLE_BASE_PATH + `-${list_id_str}.json`, {
            encoding: "utf-8",
          })
          .then((content) => JSON.parse(content))
          .catch((_err) => getSample(list_id_str, SAMPLE_BASE_PATH));
    res.send(sample[getLoopThree()]);
  });
