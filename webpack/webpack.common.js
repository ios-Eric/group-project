const path = require("path");
const { ProgressPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const _resolvePath = (url) => path.join(__dirname, url);

module.exports = {
    stats: "none",
    mode: "development",
    entry: _resolvePath("../src/index.tsx"),
    output: {
        filename: "[name].[contenthash:10].js",
        path: _resolvePath("../dish"),
        clean: true,
        assetModuleFilename: "assets/[hash][ext]"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json", ".jsx"]
    },
    plugins: [
        new CleanWebpackPlugin({
            path: _resolvePath("../dish")
        }),
        new HtmlWebpackPlugin({
            title: "demo",
            template: 'public/index.html'
        }),
        new MiniCssExtractPlugin({
            filename: "css/built.[contenthash:10].css",
        }),
        new ESLintWebpackPlugin({
            extensions: ["js"],
            context: _resolvePath("../src"),
            exclude: "../node_modules",
        }),
        new ProgressPlugin(),
        new LodashModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.tsx|jsx|js|ts?$/,
                use: "babel-loader",
                exclude:  [/[\\/]node_modules[\\/]/],
            },
            {
                enforce: "pre",
                test: /\.tsx|jsx|js|ts$/,
                use: "source-map-loader",
                exclude:  [/[\\/]node_modules[\\/]/],
            },
            {
                test: /\.css$/,
                exclude: [/[\\/]node_modules[\\/].*antd/],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                            modules: {
                                mode: "local",
                                localIdentName: "[name]__[local]--[hash:base64:5]"
                            }
                        }
                    },
                    "postcss-loader",
                ]
            },
            {
                test: /\.css$/,
                include: [/[\\/]node_modules[\\/].*antd/],
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.less$/i,
                exclude: [/[\\/]node_modules[\\/].*antd/],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader:"css-loader",
                        options: {
                            importLoaders: 2,
                            modules: {
                                localIdentName: "[name]__[local]--[hash:base64:5]",
                            }
                        }
                    }, 
                    "postcss-loader",
                    {
                        loader: "less-loader",
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpeg|jpg|gif)/,
                type: 'asset/resource'
            }
        ]
    }
}
