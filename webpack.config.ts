import path from "path";
import { Configuration, DefinePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import DotEnvPlugin from "dotenv-webpack";

const webpackConfig: Configuration = {
  entry: { app: ["./src/frontend/index.tsx"] },
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
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
  },
  target: "web",
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
          configFile: "tsconfig.build.json",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/frontend/index.html" }),
    new DefinePlugin({
      "process.env.getTweetsUrl": JSON.stringify("/api/tweet"),
      "process.env.getRateUrl": JSON.stringify("/api/rate"),
    }),
    new DotEnvPlugin(),
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};

export default webpackConfig;
