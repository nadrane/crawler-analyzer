"use strict";

const path = require("path");
const webpack = require("webpack");
const devMode = true;
const LiveReloadPlugin = require("webpack-livereload-plugin");

const config = {
  entry: "./browser/index.js",
  output: {
    path: __dirname,
    filename: "./public/bundle.js"
  },
  context: __dirname,
  devtool: "source-map",
  resolve: {
    modules: ["node_modules"],
    extensions: [".", ".jsx", ".js"]
  },
  target: "electron",
  plugins: [new LiveReloadPlugin({ appendScriptTag: true })],
  module: {
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
};

module.exports = config;
