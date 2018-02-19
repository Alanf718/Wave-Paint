'use strict';

// Helper: root(), and rootDir() are defined at the bottom
var path = require('path');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// --optimize-dedupe not needed https://webpack.js.org/guides/migrating/#dedupeplugin-has-been-removed
// --optimize-occurence-order is on by default
// https://webpack.js.org/guides/migrating/#occurrenceorderplugin-is-now-on-by-default

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;


const serverConfig = {
    node: {
        __dirname: true
    },
    entry: {
        server: "./src/server/index.js"
    },
    target: "node",
    output: {
        path: __dirname,
        filename: "[name].js",
        libraryTarget: "commonjs2"
    },
    devtool: "cheap-module-source-map",
    module: {
        rules: [
            {
                test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: "file-loader",
                options: {
                    name: "public/media/[name].[ext]",
                    publicPath: url => url.replace(/public/, ""),
                    emit: false
                }
            },
            {
                test: /\.less$/,
                use: [{loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'postcss-loader'},
                    {loader: 'less-loader'}]
            },
            // {
            //     test: /\.(css|scss)$/,
            //     use: [
            //         {loader: 'style-loader', query: {sourceMap: ENV !== 'prebuild'}},
            //         {loader: 'css-loader', query: {sourceMap: ENV !== 'prebuild'}},
            //         {loader: 'postcss-loader', query: {sourceMap: ENV !== 'prebuild'}},
            //         {
            //             loader: 'sass-loader',
            //             options: {
            //                 sourceMap: ENV !== 'prebuild'
            //             },
            //         }]
            // },
            {
                test: /\.(css|scss)$/,
                use: ExtractTextPlugin.extract({
                    fallback:'style-loader',
                    use:['css-loader', 'postcss-loader', 'sass-loader'],
                })
            },
            {
                test: /js$/,
                exclude: /(node_modules)/,
                loader: "babel-loader",
                options: {
                    presets: [
                        'es2015',
                        'stage-2',
                        'react'
                    ]
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({filename:'app.bundle.css'}),
    ]
};


const targets = ['node'].map((target) => {
    return webpackMerge(serverConfig, {
        target: target,
        output: {
            path: path.resolve(__dirname, 'dist/server'),
            filename: 'server.js',
            // libraryTarget: 'commonjs2'
        }
    });
});

module.exports = targets;
