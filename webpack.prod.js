const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
<<<<<<< HEAD
const merge = require('webpack-merge');
=======
const { merge } = require('webpack-merge');
>>>>>>> 02fff9e5e4f4887cf4492e23c51863e75689be74
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    format: {
                        comments: false
                    }
                },
                extractComments: false
            })
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
<<<<<<< HEAD
        }),
        new TerserPlugin({
            parallel: true,
            sourceMap: true
=======
>>>>>>> 02fff9e5e4f4887cf4492e23c51863e75689be74
        })
    ]
});
