const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = merge(common, {
    entry: [
        'core-js/stable',
        'regenerator-runtime/runtime',
        './index.js'
    ],
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader']
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                sourceMap: true
            })
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ]
});
