import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import getConfigDev from "webpack.config.dev";
import { app } from "./app";

const config = getConfigDev({ production: false, development: true });
const compiler = webpack(config);

export const devApp = app
  .use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output?.publicPath,
      stats: "errors-only",
    })
  )
  .use(webpackHotMiddleware(compiler));
