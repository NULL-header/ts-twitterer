/* eslint-disable @typescript-eslint/no-misused-promises */
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import config from "webpack.config.dev";
import { app } from "./app";

const compiler = webpack(config);

export const devApp = app
  .use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output?.publicPath as string,
      stats: "errors-only",
    }),
  )
  .use(webpackHotMiddleware(compiler));
