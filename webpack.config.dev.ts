import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import DotEnvPlugin from "dotenv-webpack";
import packageJSON from "./package.json";

const webpackConfig = (env: {
  production: any;
  development: any;
}): webpack.Configuration => ({
  entry: [
    "webpack-hot-middleware/client?reload=true&timeout=1000",
    "./src/frontend/index.dev.tsx",
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [
      new TsconfigPathsPlugin({ configFile: "./tsconfig.json" }) as any,
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
          configFile: path.resolve(__dirname, "./tsconfig.json"),
        },
        exclude: /public/,
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
    new webpack.DefinePlugin({
      "process.env.PRODUCTION": env.production || !env.development,
      "process.env.NAME": JSON.stringify(packageJSON.name),
      "process.env.VERSION": JSON.stringify(packageJSON.version),
      "process.env.getTweetsUrl": JSON.stringify("/sample/tweet"),
      "process.env.getRateUrl": JSON.stringify("/sample/rate"),
    }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new DotEnvPlugin(),
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
});

export default webpackConfig;
