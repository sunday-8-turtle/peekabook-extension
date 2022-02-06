const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    popup: "./src/popup/index.ts",
    background: "./src/background/index.ts",
    contentScript: "./src/contentScript/index.ts",
  },
  module: {
    rules: [{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ }],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({ template: "src/popup/index.html" }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/manifest.json" },
        { from: "./src/assets/16x16_활성.png" },
        { from: "./src/assets/16x16_비활성.png" },
        { from: "./src/assets/48x48.png" },
        { from: "./src/assets/128x128.png" },
      ],
    }),
  ],
  output: { filename: "[name].js", path: path.resolve(__dirname, "dist") },
};
