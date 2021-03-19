import path from "path";
import { Configuration, HotModuleReplacementPlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import DotEnvPlugin from "dotenv-webpack";

const webpackConfig: Configuration = {
  mode: "development",
  entry: [
    "webpack-hot-middleware/client?reload=true&timeout=1000",
    "./src/frontend/index.dev.tsx",
  ],
  target: "web",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [
      new TsconfigPathsPlugin({ configFile: "tsconfig.build.json" }) as any,
    ],
  },
  output: {
    path: path.join(__dirname, "/public"),
    filename: "bundle.js",
    publicPath: "/",
    pathinfo: false,
  },
  devtool: "eval-cheap-module-source-map",
  module: {
    rules: [
      {
        test: /.*src\/frontend\/worker\/connect\/index.ts/,
        loader: "comlink-loader",
        options: {
          singleton: true,
        },
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          configFile: "tsconfig.build.json",
        },
      },
      {
        test: /\.js/,
        enforce: "pre",
        loader: "source-map-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/frontend/index.html" }),
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new DotEnvPlugin(),
    new ForkTsCheckerWebpackPlugin(),
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};

export default webpackConfig;
