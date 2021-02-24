import path from "path";
import { Configuration, DefinePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import DotEnvPlugin from "dotenv-webpack";

const webpackConfig: Configuration = {
  entry: { app: ["./src/frontend/index.tsx"] },
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
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: path.resolve(__dirname, "./tsconfig.json"),
        },
        exclude: /public/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/frontend/index.html" }),
    new DefinePlugin({
      "process.env.getTweetsUrl": JSON.stringify("/api/tweet"),
      "process.env.getRateUrl": JSON.stringify("/api/rate"),
    }),
    new ForkTsCheckerWebpackPlugin(),
    new DotEnvPlugin(),
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};

export default webpackConfig;
