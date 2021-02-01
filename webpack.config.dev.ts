import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import packageJSON from "./package.json";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import "webpack-dev-server";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

const webpackConfig = (env: {
  production: any;
  development: any;
}): webpack.Configuration => ({
  entry: [
    "webpack-hot-middleware/client?reload=true&timeout=1000",
    "./src/frontend/index.tsx",
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.build.json" })],
  },
  output: {
    path: path.join(__dirname, "/public"),
    filename: "bundle.js",
    publicPath: "/",
  },
  devtool: "#inline-source-map",
  devServer: {
    contentBase: "src/frontend",
    port: 3000,
    // host: "localhost",
    host: "0.0.0.0",
    open: true,
    hotOnly: true,
    noInfo: true,
    clientLogLevel: "error",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          // transpileOnly: true,
          configFile: path.resolve(__dirname, "./tsconfig.build.json"),
        },
        exclude: /public/,
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { url: false },
          },
        ],
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
    }),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
  ],
});

export default webpackConfig;
