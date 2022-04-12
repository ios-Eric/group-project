const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.common.js");
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = merge(baseConfig, {
    mode: "production",
    plugins: [
        new BundleAnalyzerPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerWebpackPlugin(),
            new TerserPlugin({
                parallel: 4,
                terserOptions: {
                  parse: {
                    ecma: 8,
                  },
                  compress: {
                    ecma: 5,
                    warnings: false,
                    comparisons: false,
                    inline: 2,
                  },
                  mangle: {
                    safari10: true,
                  },
                  output: {
                    ecma: 5,
                    comments: false,
                    ascii_only: true,
                  },
                },
              }),
        ],
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          minRemainingSize: 0,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          enforceSizeThreshold: 50000,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            styles: {
                name: "styles",
                type: "css/mini-extract",
                chunks: "all",
                enforce: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
    },
});
