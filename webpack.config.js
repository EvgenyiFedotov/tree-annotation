const path = require("path");
const nodeExternals = require("webpack-node-externals");
const WebpackBar = require("webpackbar");
const WebpackShellPlugin = require("webpack-shell-plugin");
const Package = require("./package.json");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/index.ts",
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  // devtool: "sourcemap",
  target: "node",
  // mode: "development",
  mode: "production",
  externals: [nodeExternals()],
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".ts", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new WebpackBar({
      name: Package.name,
      profile: true,
    }),
    new WebpackShellPlugin({
      // onBuildStart: ["yarn test"],
      // onBuildEnd: ["yarn build:old"],
      dev: false,
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_console: true,
          },
          ecma: 6,
          mangle: true,
        },
        sourceMap: true,
      }),
    ],
    usedExports: true,
    sideEffects: true,
  },
};
