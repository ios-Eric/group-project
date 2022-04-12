const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.common.js");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = merge(baseConfig, {
    mode: "development",
    devtool: "inline-source-map",
    plugins: [
        new BundleAnalyzerPlugin(),
    ],
});
