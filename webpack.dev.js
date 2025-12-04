const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const PORT = process.env.PORT || 3000;

module.exports = merge(common, {
    entry: [
        'core-js/stable',
        'regenerator-runtime/runtime',
        'webpack-dev-server/client?http://localhost:' + PORT,
        './index.js'
    ],
    devtool: false,
    mode: 'development',
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
            moduleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[hash]',
            fallbackModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[hash]',
            hashFunction: 'sha256'
        })
    ]
});
