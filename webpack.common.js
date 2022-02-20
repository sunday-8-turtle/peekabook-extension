const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackSkipAssetsPlugin =
  require("html-webpack-skip-assets-plugin").HtmlWebpackSkipAssetsPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    popup: path.resolve(__dirname, "./src/popup/index.ts"),
    background: path.resolve(__dirname, "./src/background/index.ts"),
    contentScript: path.resolve(__dirname, "./src/contentScript/index.ts"),
  },
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: "./src/popup/index.html",
      excludeAssets: [
        "contentScript.js",
        "background.js",
        (asset) => asset.attributes && asset.attributes["x-skip"],
      ],
    }),
    new HtmlWebpackSkipAssetsPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/manifest.json" },
        { from: "./src/assets/16x16_활성.png" },
        { from: "./src/assets/logo.png" },
        { from: "./src/assets/16x16_비활성.png" },
        { from: "./src/assets/48x48.png" },
        { from: "./src/assets/128x128.png" },
        { from: "./src/assets/bell.svg" },
        { from: "./src/assets/bell-off.svg" },
        { from: "./src/assets/icon-x.svg" },
        { from: "./src/assets/icon-check.svg" },
      ],
    }),
  ],
  output: { filename: "[name].js", path: path.resolve(__dirname, "dist") },
};
