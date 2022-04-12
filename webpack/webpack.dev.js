const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.common.js");
const path = require("path");

module.exports = merge(baseConfig, {
    mode: "development",
    devtool: "inline-source-map",
    cache: {
      type: "filesystem",
    },
    devServer: {
        compress: true,
        port: 8080,
        open: true,
        hot: true,
    },
});
