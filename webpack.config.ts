import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import packageJSON from "./package.json";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import UglifyJsPlugin from "uglifyjs-webpack-plugin";

const webpackConfig = (env: {
  production: any;
  development: any;
}): webpack.Configuration => ({
  entry: { app: ["./src/frontend/index.tsx"] },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.build.json" })],
  },
  output: {
    path: path.join(__dirname, "/public"),
    filename: "bundle.js",
    publicPath: "/",
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
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/frontend/index.html" }),
    new webpack.DefinePlugin({
      "process.env.PRODUCTION": env.production || !env.development,
      "process.env.NAME": JSON.stringify(packageJSON.name),
      "process.env.VERSION": JSON.stringify(packageJSON.version),
      "process.env.getTweetsUrl": JSON.stringify("/api/tweet"),
      "process.env.getRateUrl": JSON.stringify("/api/rate"),
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
});

export default webpackConfig;
