const path = require("path");
const nodeExternals = require("webpack-node-externals");
const WebpackBar = require("webpackbar");
const WebpackShellPlugin = require("webpack-shell-plugin");
const Package = require("./package.json");

module.exports = {
  entry: {
    index: "./src/index.js"
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js"
  },
  devtool: "sourcemap",
  target: "node",
  mode: "development",
  // mode: "production",
  externals: [nodeExternals()],
  plugins: [
    new WebpackBar({
      name: Package.name,
      profile: true
    }),
    new WebpackShellPlugin({
      // onBuildStart: ["yarn test"],
      // onBuildEnd: ["yarn build:old"],
      dev: false
    })
  ]
};
