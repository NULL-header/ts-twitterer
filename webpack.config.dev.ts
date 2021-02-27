import path from "path";
import {
  Configuration,
  DefinePlugin,
  HotModuleReplacementPlugin,
} from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import DotEnvPlugin from "dotenv-webpack";

const webpackConfig: Configuration = {
  entry: [
    "webpack-hot-middleware/client?reload=true&timeout=1000",
    "./src/frontend/index.dev.tsx",
  ],
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
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          // transpileOnly: true,
          configFile: "tsconfig.build.json",
          // onlyCompileBundledFiles: true,
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
    new DefinePlugin({
      "process.env.getTweetsUrl": JSON.stringify("/sample/tweet"),
      "process.env.getRateUrl": JSON.stringify("/sample/rate"),
    }),
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new DotEnvPlugin(),
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};

export default webpackConfig;
