const { resolve } = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const PORT = process.env.PORT || 3000;

module.exports = merge(common, {
    entry: [
        'core-js/stable',
        'regenerator-runtime/runtime',
        './index.js'
    ],
    devtool: 'source-map',
    mode: 'development',
    devServer: {
        static: {
            directory: resolve(__dirname, 'dist')
        },
        historyApiFallback: true,
        hot: false,
        port: PORT,
        client: {
            logging: 'info'
        }
    }
});
