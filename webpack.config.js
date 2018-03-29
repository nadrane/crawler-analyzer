"use strict";

const path = require("path");
const webpack = require("webpack");
const devMode = true;
const LiveReloadPlugin = require("webpack-livereload-plugin");

const config = {
  entry: "./browser/index.tsx",
  output: {
    path: __dirname,
    filename: "./public/bundle.js"
  },
  context: __dirname,
  devtool: "source-map",
  resolve: {
    modules: ["node_modules"],
    extensions: [".", ".jsx", ".js", ".tsx", ".ts"]
  },
  target: "electron",
  plugins: [new LiveReloadPlugin({ appendScriptTag: true })],
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ],
    loaders: [
      {
        test: /jsx?$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        query: {
          presets: ["react", "es2015", "stage-2"]
        }
      }
    ]
  }
  // externals: {
  //   react: "React",
  //   "react-dom": "ReactDOM"
  // }
};

module.exports = config;
